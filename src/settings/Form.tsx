import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
} from "react";
import { FormGroup, InputGroup, NumericInput, Slider } from "@blueprintjs/core";

export const NoiseForm: FC<{
  onUpdate: Dispatch<SetStateAction<NoiseSettings>>;
  settings: NoiseSettings;
}> = ({ onUpdate, settings: { layers, resolution } }) => {
  const handleChange = useCallback(
    (key: string) =>
      ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
        onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
      },
    [onUpdate]
  );
  const handleValueChange = useCallback(
    (key: string) => (value: number) => {
      onUpdate((prevSettings) => ({ ...prevSettings, [key]: value }));
    },
    [onUpdate]
  );
  const handleLayerValueChange = useCallback(
    (index: number, key: string) => (value: number) => {
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
  return (
    <form className="NoiseForm">
      <FormGroup className="NoiseForm-resolution" label="Resolution">
        <NumericInput
          fill={true}
          min={0.01}
          max={1}
          minorStepSize={null}
          onValueChange={handleValueChange("resolution")}
          stepSize={0.01}
          value={resolution}
        />
      </FormGroup>
      {layers.map(({ scale, seed, speed }, index) => {
        return (
          <div className="NoiseForm-layer" key={index}>
            <FormGroup className="NoiseForm-layer-seed" label="Seed">
              <InputGroup
                defaultValue={seed}
                fill={true}
                onChange={handleChange("seed")}
              />
            </FormGroup>
            <FormGroup className="NoiseForm-layer-scale" label="Scale">
              <Slider
                labelStepSize={11}
                max={100}
                min={1}
                onChange={handleLayerValueChange(index, "scale")}
                stepSize={1}
                value={scale}
              />
            </FormGroup>
            <FormGroup className="NoiseForm-layer-speed" label="Speed">
              <Slider
                labelStepSize={0.2}
                max={1}
                min={0}
                onChange={handleLayerValueChange(index, "speed")}
                stepSize={0.01}
                value={speed}
              />
            </FormGroup>
          </div>
        );
      })}
    </form>
  );
};

export default NoiseForm;
