import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './CpuLoadChart.css';
import { CPUDataGlobalState, CPULoadDataPoint } from '../../dataLoader/data-types';

/**
 * Chart configurations
 */
const VIEWBOX_HEIGHT = 300;
const VIEWBOX_WIDTH = 300;
const PADDING = 0;
const STROKE_WIDTH = 2;

/**
 * D3 Line Chart to display CPU Data Load in the last 10minutes.
 */
function CpuLoadChart(props: CPUDataGlobalState) {
  /**
   * SVG Element to attach D3 chart
   */
  const svgReference = useRef<SVGSVGElement>(null);
  const tooltipReference = useRef<SVGTextElement>(null);
  /**
   * Index of the closest data point to mouse position
   */
  const [activeDatapointIndex, setActiveDatapointIndex] = useState<number | null>(null);
  
  /**
   * Minimum and maximum Y axis current values
   */
  const yMinValue = d3.min(props.cpuLoadData.queue, (d) => d.cpuLoad) as number;
  const yMaxValue = d3.max(props.cpuLoadData.queue, (d) => d.cpuLoad) as number;

  // Set X and Y scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(props.cpuLoadData.queue, (e: CPULoadDataPoint): Date => new Date(e.timestamp)) as [Date, Date])
    .range([0, VIEWBOX_WIDTH]);

  const yScale = d3
    .scaleLinear()
    .domain([yMinValue, yMaxValue])
    .range([VIEWBOX_HEIGHT, 0]);

  // Getters for axis values
  const getXAxis = (svgReference: SVGSVGElement) => {
    const xAxis = d3.axisBottom(xScale);
    d3.select(svgReference).call(xAxis.tickFormat(d3.timeFormat('%I:%M') as any));
  };
  const getYAxis = (svgReference: SVGSVGElement) => {
      const yAxis = d3.axisLeft(yScale).tickSize(-VIEWBOX_WIDTH / 100).tickPadding(7);
      d3.select(svgReference).call(yAxis);
  };

  // Line and area paths drawn on chart
  const linePath = d3
      .line<CPULoadDataPoint>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(d.cpuLoad))
      .curve(d3.curveMonotoneX)(props.cpuLoadData.queue);

  const areaPath = d3
      .area<CPULoadDataPoint>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y0((d) => yScale(d.cpuLoad))
      .y1(() => yScale(yMinValue))
      .curve(d3.curveMonotoneX)(props.cpuLoadData.queue);

  /**
   * Handle mouse move on chart to display/hide tooltip 
     * Handle mouse move on chart to display/hide tooltip 
   * Handle mouse move on chart to display/hide tooltip 
   */
  const handleMouseMove = (e: MouseEvent) => {
    const bisectDate = d3.bisector((d: any) => new Date(d.timestamp)).left;
    const x0 = xScale.invert(d3.pointer(e, e.target)[0]);
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
          <path fill={'blue'} d = {areaPath as any} opacity={0.3} />
          <path strokeWidth={STROKE_WIDTH} fill="none" stroke={'blue'} d={linePath as any} />
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
            x={VIEWBOX_WIDTH / 2} y={PADDING / 2} textAnchor="middle" >
            {"CPU Average Load Monitor"}
        </text>
        <text
            transform={"rotate(-90)"}
            x={0 - VIEWBOX_HEIGHT / 2 } y={PADDING + 10} dy="1em">
            {"CPU Average Load"}
        </text>
        <text
            x={VIEWBOX_WIDTH / 2 + PADDING} y={VIEWBOX_HEIGHT - 20} textAnchor="middle" >
            {"Time hh:mm"}
        </text>

        {/* Tooltip explorer */}
        {props.cpuLoadData.toArray().map((item, index) => {
              return (
                  <g key={index}>
                      <rect
                        width="60" 
                        height="20" 
                        style={{fill:'white', strokeWidth:0, display: index === activeDatapointIndex ? 'block': 'none'}}
                        x={xScale(new Date(item.timestamp)) + 10}
                        y={yScale(item.cpuLoad) - 15}
                        rx={5}>
                        </rect>
                        <text
                            className = 'tooltip-text'
                            ref={tooltipReference} 
                            fill="#666"
                            x={xScale(new Date(item.timestamp))}
                            y={yScale(item.cpuLoad)}
                        >
                            <tspan x={xScale(new Date(item.timestamp)) + 13}>{index === activeDatapointIndex ? `CPU: ${Math.round(item.cpuLoad * 1000) / 1000}` : ""}</tspan>
                        </text>
                      <circle
                          cx={xScale(new Date(item.timestamp)) + PADDING}
                          cy={yScale(item.cpuLoad) - PADDING}
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
