import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset, WeightedRandomSampler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib

# ── Path setup ────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_RAW   = os.path.join(SCRIPT_DIR, "..", "raw")
PROCESSED  = os.path.join(SCRIPT_DIR, "..", "processed")
MODELS_DIR = os.path.join(SCRIPT_DIR, "..", "..", "models")

os.makedirs(PROCESSED, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
# ─────────────────────────────────────────────────────────

FEATURE_COLS = [
    "home_elo", "home_fifa_rank", "home_total_mv", "home_top5_mv",
    "home_avg_age", "home_avg_caps", "home_stars", "home_elite",
    "home_winrate", "home_gd_avg", "home_form",
    "away_elo", "away_fifa_rank", "away_total_mv", "away_top5_mv",
    "away_avg_age", "away_avg_caps", "away_stars", "away_elite",
    "away_winrate", "away_gd_avg", "away_form",
    "delta_elo", "delta_rank", "delta_mv", "delta_form", "delta_winrate",
    "is_neutral", "home_pens", "away_pens",
]


# ── Model Architectures ───────────────────────────────────

class MatchPredictor(nn.Module):
    """Predicts match outcome: 0=away win, 1=draw, 2=home win"""
    def __init__(self, input_dim=30):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.BatchNorm1d(256),
            nn.GELU(),
            nn.Dropout(0.3),

            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.GELU(),
            nn.Dropout(0.25),

            nn.Linear(128, 64),
            nn.GELU(),
            nn.Dropout(0.15),

            nn.Linear(64, 32),
            nn.GELU(),

            nn.Linear(32, 3),
        )

    def forward(self, x):
        return self.net(x)


class ScorePredictor(nn.Module):
    """Predicts scoreline — two regression heads (home goals, away goals)"""
    def __init__(self, input_dim=30):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.GELU(),
        )
        self.home_out = nn.Linear(64, 1)
        self.away_out = nn.Linear(64, 1)

    def forward(self, x):
        s = self.shared(x)
        return torch.relu(self.home_out(s)), torch.relu(self.away_out(s))


# ── Training ──────────────────────────────────────────────

def train():
    print("=" * 50)
    print("STEP 4: Training Match & Score Models")
    print("=" * 50)

    df = pd.read_csv(os.path.join(PROCESSED, "match_dataset.csv"))
    df = df.dropna(subset=FEATURE_COLS).reset_index(drop=True)
    print(f"Training samples: {len(df)}")

    X       = df[FEATURE_COLS].values.astype(np.float32)
    y       = df["result"].values.astype(np.int64)
    y_home  = df["home_score"].values.astype(np.float32)
    y_away  = df["away_score"].values.astype(np.float32)
    weights = df["sample_weight"].values.astype(np.float32)

    # Scale features
    scaler = StandardScaler()
    X      = scaler.fit_transform(X)
    joblib.dump(scaler,       os.path.join(MODELS_DIR, "scaler.pkl"))
    joblib.dump(FEATURE_COLS, os.path.join(MODELS_DIR, "feature_cols.pkl"))
    print("Scaler saved.")

    # Train / val split — stratified by result class
    (X_tr, X_val,
     y_tr, y_val,
     w_tr, w_val,
     yh_tr, yh_val,
     ya_tr, ya_val) = train_test_split(
        X, y, weights, y_home, y_away,
        test_size=0.15, random_state=42, stratify=y
    )

    print(f"Train: {len(X_tr)} | Val: {len(X_val)}")

    # Weighted sampler to handle class imbalance (draws are rare)
    sampler   = WeightedRandomSampler(torch.FloatTensor(w_tr), len(w_tr), replacement=True)
    train_ds  = TensorDataset(
        torch.FloatTensor(X_tr),  torch.LongTensor(y_tr),
        torch.FloatTensor(yh_tr), torch.FloatTensor(ya_tr),
    )
    val_ds    = TensorDataset(
        torch.FloatTensor(X_val), torch.LongTensor(y_val),
        torch.FloatTensor(yh_val),torch.FloatTensor(ya_val),
    )
    train_loader = DataLoader(train_ds, batch_size=128, sampler=sampler)
    val_loader   = DataLoader(val_ds,   batch_size=128, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")

    input_dim   = X.shape[1]
    match_model = MatchPredictor(input_dim).to(device)
    score_model = ScorePredictor(input_dim).to(device)

    m_opt = torch.optim.AdamW(match_model.parameters(), lr=2e-3, weight_decay=1e-4)
    s_opt = torch.optim.AdamW(score_model.parameters(), lr=2e-3, weight_decay=1e-4)

    m_sched = torch.optim.lr_scheduler.OneCycleLR(
        m_opt, max_lr=2e-3, epochs=80, steps_per_epoch=len(train_loader)
    )
    s_sched = torch.optim.lr_scheduler.OneCycleLR(
        s_opt, max_lr=2e-3, epochs=80, steps_per_epoch=len(train_loader)
    )

    ce_loss  = nn.CrossEntropyLoss()
    mse_loss = nn.MSELoss()

    best_val_acc = 0.0
    print("\nTraining... (80 epochs)")

    for epoch in range(80):
        match_model.train()
        score_model.train()

        for Xb, yb, yh, ya in train_loader:
            Xb = Xb.to(device)
            yb = yb.to(device)
            yh = yh.to(device)
            ya = ya.to(device)

            # Match result loss
            m_opt.zero_grad()
            loss_m = ce_loss(match_model(Xb), yb)
            loss_m.backward()
            m_opt.step()
            m_sched.step()

            # Score prediction loss
            s_opt.zero_grad()
            ph, pa = score_model(Xb)
            loss_s = mse_loss(ph.squeeze(), yh) + mse_loss(pa.squeeze(), ya)
            loss_s.backward()
            s_opt.step()
            s_sched.step()

        # Validation
        match_model.eval()
        preds_all  = []
        labels_all = []

        with torch.no_grad():
            for Xb, yb, _, _ in val_loader:
                preds = match_model(Xb.to(device)).argmax(1).cpu().tolist()
                preds_all.extend(preds)
                labels_all.extend(yb.tolist())

        val_acc = accuracy_score(labels_all, preds_all)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(match_model.state_dict(), os.path.join(MODELS_DIR, "match_predictor.pt"))
            torch.save(score_model.state_dict(), os.path.join(MODELS_DIR, "score_predictor.pt"))
            print(f"Epoch {epoch+1:3d} | Val Acc: {val_acc:.4f} ✅  (saved)")
        elif (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1:3d} | Val Acc: {val_acc:.4f}")

    print(f"\n✅ STEP 4 COMPLETE — Best Val Accuracy: {best_val_acc:.4f}")
    print("\nClassification Report (last epoch):")
    print(classification_report(
        labels_all, preds_all,
        target_names=["Away Win", "Draw", "Home Win"]
    ))


if __name__ == "__main__":
    train()