import { createContext, useContext } from "react";

export const DEFAULT_SETTINGS: SettingsContext = {
  noise: {
    layers: [
      { scale: 12, speed: 1 / 5, seed: "1" },
      { scale: 24, speed: 1 / 5, seed: "2" },
      { scale: 96, speed: 1 / 5, seed: "3" },
    ],
    resolution: 1 / 4,
  },
};

export const Settings = createContext<SettingsContext>(DEFAULT_SETTINGS);

const useSettings = () => useContext(Settings);
export default useSettings;
