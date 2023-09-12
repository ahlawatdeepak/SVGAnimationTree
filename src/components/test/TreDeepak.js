import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from 'react';


const Tree = () =>{
    const svgRef = useRef(null)
    const [angle,setAngle] = useState(24)
    const handleChange = (e) =>{
        setAngle(e.target.value)
    }

    useEffect(()=>{
        const draw = SVG().addTo(svgRef.current)

        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        draw.size(canvasWidth,canvasHeight)
        draw.viewbox(0,0,canvasWidth,canvasHeight)

        const mainBranch = draw.group().translate(canvasWidth/2,canvasHeight)
        
         function branch(parent,len){
            const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
            console.log(strokeWidth)
            const lines = parent.line(0,0,0,0).stroke({width:strokeWidth,color:"red"})
            
            lines.animate(3000).plot(0,0,0,-len).loop()

            if(len >= 10){
                const leftLine = parent.group()
                const rightLine = parent.group()

                leftLine.translate(0,-len)
                rightLine.translate(0,-len)

                leftLine.rotate(-angle)
                rightLine.rotate(angle)

                parent.add(leftLine)
                parent.add(rightLine)
                parent.addClass('animate')

                // parent.circle(strokeWidth+5).center(0,0-len)
                branch(leftLine,len*.75)
                branch(rightLine,len*.65)
            }
            else{
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                const x ="rgb(" + r + "," + g + "," + b + ")";
                parent.circle(strokeWidth+5).center(0,0-len).fill(x)
                
            }

        }
        branch(mainBranch,150)
        // return()=>{draw.clear()}

    },[])

    return<>
    <div ref={svgRef}/>
    <input onChange={handleChange}/>
    </>
}


export default Tree