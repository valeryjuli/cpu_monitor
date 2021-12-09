import { arc, pie, PieArcDatum, select } from 'd3';
import { useEffect, useRef } from 'react';
import { CPUDataGlobalState } from '../../dataLoader/data-types';

const VIEWBOX_HEIGHT = 300;
const VIEWBOX_WIDTH = 300;

/**
 * Component providing gauge chart for CPU Average Load
 */
function CpuGauge(props: CPUDataGlobalState) {
    const wrapperReference = useRef<HTMLDivElement>(null);
    const svgReference = useRef<SVGSVGElement>(null);
    
  useEffect(() => {
      if (props.cpuLoadData.queue.length > 0) {
        const svg = select(svgReference.current);

    const arcGenerator = arc<PieArcDatum<number>>()
      .innerRadius(75)
      .outerRadius(150);

    const pieGenerator = pie<number>()
      .startAngle(-0.5 *  Math.PI)
      .endAngle(0.5 * Math.PI)
      .sort(null);

    const lastLoad = props.cpuLoadData.queue[props.cpuLoadData.queue.length - 1].cpuLoad;
    const instructions = pieGenerator([lastLoad, 1 - lastLoad]);

    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (instruction, index) => (index === 0 ? "blueviolet" : "#eee"))
      .style(
        "transform",
        `translate(50%, 50%)`
      )
      .attr('d', instruction => arcGenerator(instruction))
    }
    
  }, [props]);
  
  return (
    <div 
        className="cpu-gauge"
        ref={wrapperReference}>
        <h2>{props.cpuLoadData.queue.length > 0 ? 'LIVE CPU Average Load: ' + Math.round((props.cpuLoadData.queue[props.cpuLoadData.queue.length - 1].cpuLoad) * 10000 ) / 100 + '%': 'Loading...'}</h2>
        <svg 
            ref={svgReference}
            viewBox={`0 0 ${VIEWBOX_HEIGHT} ${VIEWBOX_WIDTH}`}
            style={{ width: '100%', height: '100%'}}></svg>
    </div>
  );
}

export default CpuGauge;
