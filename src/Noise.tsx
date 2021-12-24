import React, { FC, HTMLProps, useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import Canvas from "./Canvas";

function noiseToRgba(noise: number) {
  const normalizedNoise = (noise + 1) / 2;
  const rgb = Math.round(normalizedNoise * 255);
  return [rgb, rgb, rgb, 255];
}

export const useNoise = (
  width: number,
  height: number,
  randomOrSeed?: string | number
) => {
  const simplex = useMemo<SimplexNoise>(
    () => new SimplexNoise(randomOrSeed),
    [randomOrSeed]
  );
  const imageData = useMemo(
    () => new ImageData(width, height),
    [width, height]
  );
  return useCallback(
    (
      layers: {
        scale: number;
        speed: number;
      }[],
      z: number = 0
    ) => {
      for (let x = 0; x < imageData.width; x += 1) {
        for (let y = 0; y < imageData.height; y += 1) {
          const noise = layers.reduce(
            (n, { scale, speed }) =>
              n +
              simplex.noise3D(x / scale, y / scale, z * speed) / layers.length,
            0
          );
          const [r, g, b, a] = noiseToRgba(noise);
          const index = y * (imageData.width * 4) + x * 4;
          imageData.data[index + 0] = r;
          imageData.data[index + 1] = g;
          imageData.data[index + 2] = b;
          imageData.data[index + 3] = a;
        }
      }
      return imageData;
    },
    [imageData, simplex]
  );
};

const Noise: FC<
  HTMLProps<HTMLCanvasElement> & {
    width: number;
    height: number;
    layers: {
      scale: number;
      speed: number;
    }[];
    resolution?: number;
  }
> = ({ width, height, layers, resolution = 1, ...props }) => {
  const computedWidth = Math.round(width * resolution);
  const computedHeight = Math.round(height * resolution);
  const computeNoise = useNoise(computedWidth, computedHeight);
  const handleUpdate = useCallback(
    (context: CanvasRenderingContext2D) => {
      const z = Date.now() / 1000;
      const imageData = computeNoise(layers, z);
      context.putImageData(imageData, 0, 0);
    },
    [computeNoise, layers]
  );

  return (
    <Canvas
      className="Noise"
      onUpdate={handleUpdate}
      width={computedWidth}
      height={computedHeight}
      style={{ width, height }}
      {...props}
    />
  );
};

export default Noise;
