import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Noise from "./Noise";

const getSize = (): [number, number] => [window.innerWidth, window.innerHeight];

function App() {
  const [[width, height], setSize] = useState(getSize);
  const handleResize = useCallback(() => setSize(getSize), []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="App">
      <Noise
        layers={[
          { scale: 12, speed: 1 / 5 },
          { scale: 24, speed: 1 / 5 },
          { scale: 96, speed: 1 / 5 },
        ]}
        width={width}
        height={height}
        resolution={1 / 4}
      />
    </div>
  );
}

export default App;
