from fastapi import APIRouter
from app.models.prediction import SimulateRequest, SimulateResponse
from app.controllers.simulate_controller import simulate_tournament

router = APIRouter()


@router.post("/tournament", response_model=SimulateResponse)
async def run_tournament_simulation(req: SimulateRequest):
    """
    Simulate a full FIFA World Cup tournament.
    - Runs N Monte Carlo simulations to compute championship probabilities
    - Also returns one full bracket for visual display
    - n_simulations: 50, 75, or 100
    """
    return await simulate_tournament(
        n_simulations=req.n_simulations,
        custom_groups=req.custom_groups,
    )
