import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './CpuLoadChart.css';
import { CPUDataGlobalState, CPULoadDataPoint } from '../../dataLoader/data-types';

/**
 * SVG Plot container viewbox dimmensions and padding
 */
const VIEWBOX_HEIGHT = 500;
const VIEWBOX_WIDTH = 500;
const PADDING = 40;

/**
 * D3 Line Chart to display CPU Data Load in the last 10minutes.
 */
function CpuLoadChart(props: CPUDataGlobalState) {
  /**
   * SVG Element to attach D3 chart
   */
  const svgReference = useRef<SVGSVGElement>(null);
  /**
   * Index of the closest data point to mouse position
   */
  const [activeDatapointIndex, setActiveDatapointIndex] = useState<number | null>(null);

    const yMinValue = d3.min(props.cpuLoadData.queue, (d) => d.cpuLoad) as number;
    const yMaxValue = d3.max(props.cpuLoadData.queue, (d) => d.cpuLoad) as number;

    // Set scaling
    const getX = d3
      .scaleTime()
      .domain(d3.extent(props.cpuLoadData.queue, (e: CPULoadDataPoint): Date => new Date(e.timestamp)) as [Date, Date])
      .range([0, VIEWBOX_WIDTH]);

    const getY = d3
      .scaleLinear()
      .domain([yMinValue, yMaxValue])
      .range([VIEWBOX_HEIGHT, 0]);

    // Getters for axis values
    const getXAxis = (svgReference: SVGSVGElement) => {
      const xAxis = d3.axisBottom(getX);
      d3.select(svgReference).call(xAxis.tickFormat(d3.timeFormat('%I:%M') as any));
    };

    const getYAxis = (svgReference: SVGSVGElement) => {
        const yAxis = d3.axisLeft(getY).tickSize(-VIEWBOX_WIDTH / 100).tickPadding(7);
        d3.select(svgReference).call(yAxis);
    };

    const linePath = d3
        .line<CPULoadDataPoint>()
        .x((d) => getX(new Date(d.timestamp)))
        .y((d) => getY(d.cpuLoad))
        .curve(d3.curveMonotoneX)(props.cpuLoadData.queue);

    const areaPath = d3
        .area<CPULoadDataPoint>()
        .x((d) => getX(new Date(d.timestamp)))
        .y0((d) => getY(d.cpuLoad))
        .y1(() => getY(yMinValue))
        .curve(d3.curveMonotoneX)(props.cpuLoadData.queue);

    /**
     * Handle mouse move on chart to display/hide tooltip 
     */
    const handleMouseMove = (e: MouseEvent) => {
      const bisectDate = d3.bisector((d: any) => new Date(d.timestamp)).left;
      const x0 = getX.invert(d3.pointer(e, e.target)[0]);
      const index = bisectDate(props.cpuLoadData.queue, x0, 1);
      setActiveDatapointIndex(index);
    };
    const handleMouseLeave = () => {
        setActiveDatapointIndex(null);
    };


  return (
    <div className="cpu-load-chart">
      <svg
        className='load-chart-svg' 
        viewBox={`0 0 ${VIEWBOX_HEIGHT} ${VIEWBOX_WIDTH}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      > 
        <g
          ref={svgReference}
          transform={`translate(${PADDING}, ${-PADDING})`} >
          <path fill={'blue'} d={areaPath as any} opacity={0.3} />
          <path strokeWidth={2} fill="none" stroke={'blue'} d={linePath as any} />
        </g>
        <g 
            className="axis" 
            ref={getYAxis}
            transform={`translate(${PADDING}, ${ -PADDING})`}
        />
        <g
            className="axis xAxis"
            ref={getXAxis}
            transform={`translate(${PADDING}, ${VIEWBOX_HEIGHT - PADDING})`}
        />
        <text
            x={VIEWBOX_WIDTH / 2} y={PADDING / 2} text-anchor="middle" >
            {"CPU Average Load Monitor"}
        </text>
        <text
            transform={"rotate(-90)"}
            x={0 - VIEWBOX_HEIGHT / 2 } y={PADDING + 10} dy="1em">
            {"CPU Average Load"}
        </text>
        <text
            x={VIEWBOX_WIDTH / 2 + PADDING} y={VIEWBOX_HEIGHT - 10} textAnchor="middle" >
            {"Time hh:mm"}
        </text>
        {props.cpuLoadData.toArray().map((item, index) => {
              return (
                  <g key={index}>
                      <text
                          fill="#666"
                          x={getX(new Date(item.timestamp))}
                          y={getY(item.cpuLoad) - 20}
                          textAnchor="middle"
                      >
                          {index === activeDatapointIndex ? `CPU: ${Math.round(item.cpuLoad)}` : ""}
                      </text>
                      <circle
                          cx={getX(new Date(item.timestamp)) + PADDING}
                          cy={getY(item.cpuLoad) - PADDING}
                          r={index === activeDatapointIndex ? 6 : 3 }
                          fill='blue'
                          strokeWidth={index === activeDatapointIndex ? 2 : 0}
                          stroke="white"
                          style={{ transition: "ease-out .1s" }}
                      />
                  </g>
              );
          })}
      </svg>
    </div>

  );
}

export default CpuLoadChart;
