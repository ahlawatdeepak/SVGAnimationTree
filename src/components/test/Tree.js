import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from 'react';

const Tree = () => {
  const svgRef = useRef(null);
  const [angle, setAngle] = useState(Math.PI * 10);

  useEffect(() => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const draw = SVG().addTo(svgRef.current);
    draw.size("100%", "100%");
    function branch(parent, len) {
      const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
      const line = parent.line(0, 0, 0, -len).stroke({ width: strokeWidth, color: "Gray" });

      if (len >= 25) {
        const leftBranch = parent.group();
        const rightBranch = parent.group();

        leftBranch.translate(0, -len);
        rightBranch.translate(0, -len);

        // leftBranch.add(line.clone()); // Clone the line to prevent multiple rotations
        // rightBranch.add(line);

        leftBranch.rotate(angle, 0, 0); // Rotate from the base
        rightBranch.rotate(-angle, 0, 0); // Rotate from the base

        parent.add(leftBranch);
        parent.add(rightBranch);

        branch(leftBranch, len * 0.67);
        branch(rightBranch, len * 0.73);
      } else {
        // Calculate the position for the circle at the tail of the branch
        const circleX = 0;
        const circleY = -len;

        // Add the circle at the calculated position
        parent.circle(12).center(circleX, circleY).fill({ color: "red" }).stroke({ width: 0 });
      }
    }

    draw.size(canvasWidth, canvasHeight);
    draw.viewbox(0, 0, canvasWidth, canvasHeight);

    const rootBranch = draw.group().translate(canvasWidth / 2, canvasHeight);
    branch(rootBranch, 150);
  }, [angle]);

  return <div ref={svgRef} />;
};

export default Tree;