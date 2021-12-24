import React, { useCallback, useEffect, useState } from "react";
import Noise from "./Noise";
import SettingsProvider from "./settings/Provider";

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
      <SettingsProvider>
        <Noise width={width} height={height} />
      </SettingsProvider>
    </div>
  );
}

export default App;
