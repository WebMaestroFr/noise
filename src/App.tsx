import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Noise from "./Noise";

function App() {
  const [[width, height], setSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const handleResize = useCallback(
    () => setSize([window.innerWidth, window.innerHeight]),
    []
  );
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="App">
      <Noise width={width} height={height} />
    </div>
  );
}

export default App;
