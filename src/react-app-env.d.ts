/// <reference types="react-scripts" />

interface NoiseSettings {
  layers: {
    scale: number;
    seed?: string;
    speed: number;
  }[];
  resolution: number;
}

interface SettingsContext {
  noise: NoiseSettings;
}
