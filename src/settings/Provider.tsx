import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import NoiseForm from "./Form";
import { DEFAULT_SETTINGS, Settings } from "./index";

function useDebounce<T>(
  initialValue: T,
  time: number
): [T, T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => {
      clearTimeout(debounce);
    };
  }, [value, time]);

  return [debouncedValue, value, setValue];
}

export const SettingsProvider: FC = ({ children, ...props }) => {
  const [debouncedNoise, noise, setNoise] = useDebounce<NoiseSettings>(
    DEFAULT_SETTINGS["noise"],
    200
  );

  return (
    <Settings.Provider value={{ noise: debouncedNoise }} {...props}>
      {children}
      <div className="Settings">
        <NoiseForm onUpdate={setNoise} settings={noise} />
      </div>
    </Settings.Provider>
  );
};

export default SettingsProvider;
