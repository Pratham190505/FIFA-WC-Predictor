import goalSoundUrl from "../assets/sounds/goal.mp3";
import saveSoundUrl from "../assets/sounds/save.mp3";
import kickSoundUrl from "../assets/sounds/kick.mp3";
import crowdSoundUrl from "../assets/sounds/crowd.mp3";

type SoundKey = "goal" | "save" | "kick";
type HowlCtor = typeof import("howler").Howl;
type HowlInstance = InstanceType<HowlCtor>;

const soundUrls: Record<SoundKey | "crowd", string> = {
  goal: goalSoundUrl,
  save: saveSoundUrl,
  kick: kickSoundUrl,
  crowd: crowdSoundUrl,
};

const volumes: Record<SoundKey | "crowd", number> = {
  goal: 0.68,
  save: 0.5,
  kick: 0.42,
  crowd: 0.16,
};

let HowlClass: HowlCtor | null = null;
let sounds: Partial<Record<SoundKey | "crowd", HowlInstance>> = {};
let loadingPromise: Promise<void> | null = null;
let crowdId: number | null = null;
let fallbackCrowd: { context: AudioContext; source: AudioBufferSourceNode; gain: GainNode } | null =
  null;
const lastPlayed: Partial<Record<SoundKey, number>> = {};

function createNoiseBuffer(context: AudioContext, duration: number, intensity = 0.18) {
  const buffer = context.createBuffer(1, Math.max(1, context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * intensity;
  }

  return buffer;
}

function getAudioContext() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) {
    throw new Error("Web Audio is not available in this browser.");
  }

  return new AudioContextCtor();
}

function playProceduralKick() {
  const context = getAudioContext();
  const gain = context.createGain();
  const oscillator = context.createOscillator();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(115, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(48, context.currentTime + 0.09);
  gain.gain.setValueAtTime(0.32, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.13);
}

function playProceduralReaction(kind: "goal" | "save") {
  const context = getAudioContext();
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = createNoiseBuffer(context, kind === "goal" ? 1.15 : 0.58, kind === "goal" ? 0.24 : 0.16);
  filter.type = "bandpass";
  filter.frequency.value = kind === "goal" ? 860 : 360;
  filter.Q.value = kind === "goal" ? 0.7 : 1.2;
  gain.gain.setValueAtTime(kind === "goal" ? 0.24 : 0.16, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + (kind === "goal" ? 1.15 : 0.58));
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
  source.stop(context.currentTime + (kind === "goal" ? 1.2 : 0.62));
}

function playFallback(key: SoundKey) {
  try {
    if (key === "kick") {
      playProceduralKick();
      return;
    }

    playProceduralReaction(key);
  } catch {
    // Audio can be blocked by browser policy. Gameplay should never fail because sound did.
  }
}

async function loadHowler() {
  if (HowlClass) return;

  if (!loadingPromise) {
    loadingPromise = import("howler")
      .then(({ Howl }) => {
        HowlClass = Howl;
        sounds = {
          goal: new Howl({ src: [soundUrls.goal], volume: volumes.goal, preload: true }),
          save: new Howl({ src: [soundUrls.save], volume: volumes.save, preload: true }),
          kick: new Howl({ src: [soundUrls.kick], volume: volumes.kick, preload: true }),
          crowd: new Howl({
            src: [soundUrls.crowd],
            volume: volumes.crowd,
            loop: true,
            preload: true,
            html5: true,
          }),
        };
      })
      .catch(() => {
        HowlClass = null;
      });
  }

  await loadingPromise;
}

export function preloadShootoutSounds() {
  void loadHowler();
}

export function playShootoutSound(key: SoundKey) {
  const now = Date.now();

  if (lastPlayed[key] && now - lastPlayed[key] < 180) return;

  lastPlayed[key] = now;

  const sound = sounds[key];

  if (sound?.state() === "loaded") {
    sound.stop();
    sound.play();
    return;
  }

  playFallback(key);
  void loadHowler();
}

export function startCrowdAmbience() {
  void loadHowler().then(() => {
    const crowd = sounds.crowd;

    if (crowd?.state() === "loaded" && !crowd.playing(crowdId ?? undefined)) {
      crowdId = crowd.play();
      crowd.volume(volumes.crowd, crowdId);
      return;
    }

    if (!fallbackCrowd) {
      try {
        const context = getAudioContext();
        const source = context.createBufferSource();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();

        source.buffer = createNoiseBuffer(context, 2, 0.09);
        source.loop = true;
        filter.type = "lowpass";
        filter.frequency.value = 520;
        gain.gain.value = 0.045;
        source.connect(filter).connect(gain).connect(context.destination);
        source.start();
        fallbackCrowd = { context, source, gain };
      } catch {
        fallbackCrowd = null;
      }
    }
  });
}

export function stopCrowdAmbience() {
  if (sounds.crowd && crowdId !== null) {
    sounds.crowd.fade(volumes.crowd, 0, 350, crowdId);
    window.setTimeout(() => {
      sounds.crowd?.stop(crowdId ?? undefined);
      crowdId = null;
    }, 380);
  }

  if (fallbackCrowd) {
    fallbackCrowd.gain.gain.exponentialRampToValueAtTime(
      0.001,
      fallbackCrowd.context.currentTime + 0.25,
    );
    window.setTimeout(() => {
      fallbackCrowd?.source.stop();
      fallbackCrowd?.context.close();
      fallbackCrowd = null;
    }, 280);
  }
}

export const kickSound = {
  play: () => playShootoutSound("kick"),
};

export const goalSound = {
  play: () => playShootoutSound("goal"),
};

export const saveSound = {
  play: () => playShootoutSound("save"),
};

export const crowdSound = {
  play: startCrowdAmbience,
  stop: stopCrowdAmbience,
};
