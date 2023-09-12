import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from "react";

const Tree = () => {
  const svgRef = useRef(null);
  const [angle, setAngle] = useState(Math.PI * 50);
  const [expandedBranch, setExpandedBranch] = useState(null);

  useEffect(() => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const draw = SVG().addTo(svgRef.current);
    draw.size("100%", "100%");

    function branch(parent, len, levels, branchData, isExpanded, subBranch) { // Add 'subBranch' as a parameter
      const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
      const line = parent.line(0, 0, 0, -len).stroke({ width: strokeWidth, color: "Brown" });

      if (levels.length > 0) {
        const currentLevel = levels[0];
        const currentBranchData = branchData[0];

        if (currentLevel > 0 && Array.isArray(currentBranchData) && currentBranchData.length > 0) {
          const angleIncrement = Math.PI * 2 / currentBranchData.length;

          for (let i = 0; i < currentBranchData.length; i++) {
            subBranch = parent.group(); // Update 'subBranch' inside the loop
            subBranch.translate(0, -len);
            subBranch.rotate(angleIncrement * i, 0, 0);
            parent.add(subBranch);

            const isChildExpanded = isExpanded && expandedBranch === currentBranchData[i];
            branch(subBranch, len * 0.67, levels.slice(1), currentBranchData[i], isChildExpanded, subBranch);
          }
        } else if (currentLevel === 0) {
          // Village level, draw circles
          if (Array.isArray(currentBranchData)) {
            for (let i = 0; i < currentBranchData.length; i++) {
              const circleX = 0;
              const circleY = -len + (i * 20); // Adjust vertical position for multiple circles
              const population = currentBranchData[i];
              const circleColor = getColorByPopulation(population);
              subBranch.circle(12).center(circleX, circleY).fill({ color: circleColor }).stroke({ width: 0 });
            }
          }
        }
      }
    }

    // Define a function to determine circle color based on population
    function getColorByPopulation(population) {
      // You can customize the color logic based on population ranges
      if (population >= 1000) {
        return "red"; // High population, red
      } else if (population >= 500) {
        return "blue"; // Medium population, blue
      } else {
        return "green"; // Low population, green
      }
    }

    draw.size(canvasWidth, canvasHeight);
    draw.viewbox(0, 0, canvasWidth, canvasHeight);

    const rootBranch = draw.group().translate(canvasWidth / 2, canvasHeight);
    // Define the number of branches for each level: Earth -> Continents -> Countries -> States -> Districts -> Villages
    const levels = [1, 5, 3, 2, 4]; // Example: 1 Earth, 5 Continents, 3 Countries, 2 States, 4 Districts
    const branchData = [
      [ // Earth
        [ // Continent 1
          [ // Country 1
            [ // State 1
              [ // District 1
                150,  // Population for Village 1
                220,  // Population for Village 2
              ],
              [ // District 2
                300,  // Population for Village 1
              ],
            ],
            [ // State 2
              [ // District 1
                450,  // Population for Village 1
                600,  // Population for Village 2
                750,  // Population for Village 3
              ],
            ],
          ],
          [ // Country 2
            [ // State 3
              [ // District 1
                800,  // Population for Village 1
              ],
            ],
          ],
        ],
        [ // Continent 2
          // Add more countries, states, districts, and villages data here
        ],
        // Add more continents and their data here
      ],
    ];

    // Only show the default number of branches (3) at the root level
    const defaultBranchData = branchData[0].slice(0, 3);
    branch(rootBranch, 150, levels, defaultBranchData, true, null); // Initialize 'subBranch' as null

  }, [angle, expandedBranch]);

  return (
    <div>
      <button onClick={() => setExpandedBranch(null)}>Reset</button>
      <div ref={svgRef} />
    </div>
  );
};

export default Tree;
