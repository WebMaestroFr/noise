import React, { FC, HTMLProps, useCallback, useEffect, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import Canvas from "./Canvas";

export const useNoise = (width: number, height: number, scale: number) => {
  const simplex = useMemo<SimplexNoise>(() => new SimplexNoise(), []);
  const imageData = useMemo(
    () => new ImageData(width, height),
    [width, height]
  );
  useEffect(() => {
    for (let x = 0; x < imageData.width; x += 1) {
      for (let y = 0; y < imageData.height; y += 1) {
        const noise = simplex.noise2D(x / scale, y / scale);
        const index = y * (imageData.width * 4) + x * 4;
        imageData.data[index + 0] =
          imageData.data[index + 1] =
          imageData.data[index + 2] =
            ((noise + 1) / 2) * 255;
        imageData.data[index + 3] = 255;
      }
    }
  }, [imageData, simplex, scale]);
  return imageData;
};

const Noise: FC<
  HTMLProps<HTMLCanvasElement> & {
    scale?: number;
    width?: number;
    height: number;
  }
> = ({ scale = 128, width = 64, height = 64, ...props }) => {
  const imageData = useNoise(width, height, scale);
  const handleUpdate = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.putImageData(imageData, 0, 0);
    },
    [imageData]
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
