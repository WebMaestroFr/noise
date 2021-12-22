import React, { useCallback, useMemo } from "react";
import SimplexNoise from "simplex-noise";
import "./App.css";
import Canvas from "./Canvas";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SCALE = 128;

function App() {
  const simplex = useMemo<SimplexNoise>(() => new SimplexNoise(), []);
  const imageData = useMemo<ImageData>(() => {
    const nextImageData = new ImageData(WIDTH, HEIGHT);
    for (let x = 0; x < WIDTH; x += 1) {
      for (let y = 0; y < HEIGHT; y += 1) {
        const noise = simplex.noise2D(x / SCALE, y / SCALE);
        const index = y * (WIDTH * 4) + x * 4;
        nextImageData.data[index + 0] =
          nextImageData.data[index + 1] =
          nextImageData.data[index + 2] =
            ((noise + 1) / 2) * 255;
        nextImageData.data[index + 3] = 255;
      }
    }
    return nextImageData;
  }, [simplex]);
  const handleUpdate = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.putImageData(imageData, 0, 0);
    },
    [imageData]
  );

  return (
    <div className="App">
      <Canvas onUpdate={handleUpdate} width={WIDTH} height={HEIGHT} />
    </div>
  );
}

export default App;
