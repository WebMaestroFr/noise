import React, { FC, HTMLProps, useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import Canvas from "./Canvas";

function noiseToRgba(noise: number) {
  const normalizedNoise = (noise + 1) / 2;
  const rgb = Math.round(normalizedNoise * 255);
  return [rgb, rgb, rgb, 255];
}

export const useNoise = (width: number, height: number, scale: number) => {
  const simplex = useMemo<SimplexNoise>(() => new SimplexNoise(), []);
  const imageData = useMemo(
    () => new ImageData(width, height),
    [width, height]
  );
  return useCallback(
    (z: number = 0) => {
      for (let x = 0; x < imageData.width; x += 1) {
        for (let y = 0; y < imageData.height; y += 1) {
          const noise = simplex.noise3D(x / scale, y / scale, z / scale);
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
    [imageData, scale, simplex]
  );
};

const Noise: FC<
  HTMLProps<HTMLCanvasElement> & {
    scale?: number;
    width?: number;
    height: number;
  }
> = ({ scale = 128, width = 64, height = 64, ...props }) => {
  const computeNoise = useNoise(width, height, scale);
  const handleUpdate = useCallback(
    (context: CanvasRenderingContext2D) => {
      const z = Date.now() / 24;
      const imageData = computeNoise(z);
      context.putImageData(imageData, 0, 0);
    },
    [computeNoise]
  );

  return (
    <Canvas
      className="Noise"
      onUpdate={handleUpdate}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Noise;
