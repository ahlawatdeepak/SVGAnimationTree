import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from "react";

const Tree = () => {
  const svgRef = useRef(null);
  const [angle, setAngle] = useState(24);
  const handleChange = (e) => {
    setAngle(e.target.value);
  };

  async function branch(parent, len) {
    const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
    console.log(strokeWidth);
    const lines = parent
      .line(0, 0, 0, 0)
      .stroke({ width: strokeWidth, color: "#612f2f" });

    await new Promise((resolve) => {
      lines.animate(3000).plot(0, 0, 0, -len).after(resolve);
    });

    if (len >= 10) {
      const leftLine = parent.group();
      const rightLine = parent.group();

      leftLine.translate(0, -len);
      rightLine.translate(0, -len);

      leftLine.rotate(-angle);
      rightLine.rotate(angle);

      parent.add(leftLine);
      parent.add(rightLine);

      // parent.circle(strokeWidth+5).center(0,0-len)
      await Promise.all([
        branch(leftLine, len * 0.75),
        branch(rightLine, len * 0.65),
      ]);
    } else {
      // parent1.polygon([ [0, 0], [-5, -10], [5, -10],)fill("green");
      parent
        .polygon([
          [0, 0], // Center of the flower
          [-5, -10], // Left petal point
          [-5, -20], // Left petal point
          [0, -30], // Bottom petal point
          [5, -20], // Right petal point
          [5, -10], // Right petal point
        ])
        .fill("pink");
    }
  }

  useEffect(() => {
    const draw = SVG().addTo(svgRef.current);

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    draw.size(canvasWidth, canvasHeight);
    draw.viewbox(0, 0, canvasWidth, canvasHeight);

    const mainBranch = draw.group().translate(canvasWidth / 2, canvasHeight);

    branch(mainBranch, 150);
    return () => {
      draw.clear();
    };
  }, [angle]);

  return (
    <>
      <div ref={svgRef} />
      <input onChange={handleChange} />
    </>
  );
};

export default Tree;
