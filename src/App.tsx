// Jes Donnelly
// Brick Breaker React

import React, { useEffect, useState } from "react";

const YourComponent: React.FC = () => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  useEffect(() => {
    // existing useEffect code for canvas initialization
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext = canvas.getContext("2d");
    setWidth(canvas.width);
    setHeight(canvas.height);
    // other canvas-related initialization code
  }, []); // Empty dependency array to run the effect only once

  const reload = () => {
    // reload function logic
  };
  return (
    <div style={{ textAlign: "center" }}>
      <canvas id="canvas" width={width} height={height}></canvas>
      <p>Mouse moves platform &bull; Press any key to pause</p>
      <button onClick={reload}>Play again</button>
      <div id="score"></div>
    </div>
  );
};

export default YourComponent;
