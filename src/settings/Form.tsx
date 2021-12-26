import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
import {
  Button,
  FormGroup,
  InputGroup,
  NumericInput,
  RangeSlider,
  Slider,
} from "@blueprintjs/core";

type ValidationParams = { min?: number; max?: number; step?: number };
export const validateNumberInput = (
  value: number,
  { min, max, step }: ValidationParams
) => {
  if (min && (value < min || isNaN(value))) {
    return min;
  } else if (max && (value > max || isNaN(value))) {
    return max;
  } else if (isNaN(value)) {
    return 0;
  } else if (step && value % step !== 0) {
    const factor = Math.round(value / step);
    return factor * step;
  }
  return value;
};

export const NoiseForm: FC<{
  onUpdate: Dispatch<SetStateAction<NoiseSettings>>;
  settings: NoiseSettings;
}> = ({ onUpdate, settings: { layers, range, resolution } }) => {
  const handleValueChange = useCallback(
    (key: string, validation: ValidationParams) => (input: number) => {
      const value = validateNumberInput(input, validation);
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
    },
    [onUpdate]
  );
  const handleLayerChange = useCallback(
    (index: number, key: string) =>
      ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
        onUpdate((prevSettings) => {
          prevSettings.layers[index] = {
            ...prevSettings.layers[index],
            [key]: value,
          };
          return { ...prevSettings };
        });
      },
    [onUpdate]
  );
  const handleLayerValueChange = useCallback(
    (index: number, key: string, validation: ValidationParams) =>
      (input: number) => {
        const value = validateNumberInput(input, validation);
        onUpdate((prevSettings) => {
          prevSettings.layers[index] = {
            ...prevSettings.layers[index],
            [key]: value,
          };
          return { ...prevSettings };
        });
      },
    [onUpdate]
  );
  const handleRangeValueChange = useCallback(
    (key: string, validation: ValidationParams) => (input: [number, number]) => {
      const value = input.map((i) => validateNumberInput(i, validation));
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
    },
    [onUpdate]
  );
  const handleAddLayer = useCallback(() => {
    onUpdate((prevSettings) => {
      prevSettings.layers.push({
        scale: 50,
        seed: "",
        speed: 0.2,
      });
      return { ...prevSettings };
    });
  }, [onUpdate]);
  const handleRemoveLayer = useCallback(
    (index) => () => {
      onUpdate((prevSettings) => {
        prevSettings.layers.splice(index, 1);
        return { ...prevSettings, layers: prevSettings.layers };
      });
    },
    [onUpdate]
  );
  return (
    <form className="NoiseForm">
      <h1>Noise</h1>
      {layers.map(({ scale, seed, speed }, index) => {
        return (
          <div className="NoiseForm-layer" key={`${index}-${layers.length}`}>
            <FormGroup className="NoiseForm-layer-seed" label="Seed">
              <InputGroup
                defaultValue={seed}
                fill={true}
                onChange={handleLayerChange(index, "seed")}
              />
            </FormGroup>
            <FormGroup className="NoiseForm-layer-scale" label="Scale">
              <Slider
                labelStepSize={11}
                max={100}
                min={1}
                onChange={handleLayerValueChange(index, "scale", {
                  min: 1,
                  max: 100,
                  step: 1,
                })}
                stepSize={1}
                value={scale}
              />
            </FormGroup>
            <FormGroup className="NoiseForm-layer-speed" label="Speed">
              <Slider
                labelStepSize={0.2}
                max={1}
                min={0}
                onChange={handleLayerValueChange(index, "speed", {
                  min: 0,
                  max: 1,
                  step: 0.01,
                })}
                stepSize={0.01}
                value={speed}
              />
            </FormGroup>
            <Button onClick={handleRemoveLayer(index)}>Remove Layer</Button>
          </div>
        );
      })}
      <Button onClick={handleAddLayer}>Add Layer</Button>
      <h2>Settings</h2>
      <FormGroup className="NoiseForm-resolution" label="Resolution">
        <NumericInput
          fill={true}
          min={0.01}
          max={1}
          minorStepSize={null}
          onValueChange={handleValueChange("resolution", {
            min: 0.01,
            max: 1,
            step: 0.01,
          })}
          stepSize={0.01}
          value={resolution}
        />
      </FormGroup>
      <FormGroup className="NoiseForm-range" label="Range">
        <RangeSlider
          min={-1}
          max={1}
          stepSize={0.01}
          labelStepSize={0.4}
          onChange={handleRangeValueChange("range", {
            min: -1,
            max: 1,
            step: 0.01,
          })}
          value={range}
        />
      </FormGroup>
    </form>
  );
};

export default NoiseForm;
