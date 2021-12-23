import React, { FC, HTMLProps, useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import Canvas from "./Canvas";

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
          const index = y * (imageData.width * 4) + x * 4;
          imageData.data[index + 0] =
            imageData.data[index + 1] =
            imageData.data[index + 2] =
              ((noise + 1) / 2) * 255;
          imageData.data[index + 3] = 255;
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
