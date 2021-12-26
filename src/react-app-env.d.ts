/// <reference types="react-scripts" />

interface NoiseSettings {
  layers: {
    scale: number;
    seed?: string;
    speed: number;
  }[];
  resolution: number;
  range: [number, number];
}

interface SettingsContext {
  noise: NoiseSettings;
}
