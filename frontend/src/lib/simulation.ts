export const SIMULATION_COUNTS = [50, 75, 100] as const;

export type SimulationCount = (typeof SIMULATION_COUNTS)[number];

export const DEFAULT_SIMULATION_COUNT: SimulationCount = 50;
