import { tsvParse } from  "d3-dsv";
import { timeFormat } from "d3-time-format";
import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { format } from "d3-format";

import useDimensions from "react-use-dimensions";
import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries, BarSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { EdgeIndicator } from "react-stockcharts/lib/coordinates";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import { ema } from "react-stockcharts/lib/indicator";
import { last } from "react-stockcharts/lib/utils";

const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

function tooltipContent(ys) {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{
					label: "open",
					value: currentItem.open && numberFormat(currentItem.open)
				},
				{
					label: "high",
					value: currentItem.high && numberFormat(currentItem.high)
				},
				{
					label: "low",
					value: currentItem.low && numberFormat(currentItem.low)
				},
				{
					label: "close",
					value: currentItem.close && numberFormat(currentItem.close)
				}
			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value(currentItem),
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}
const keyValues = ["high", "low"];
const removeRandomValues = (data) => {
	return data.map(item => {
		const newItem = { ...item };
		const numberOfDeletion =
			Math.floor(Math.random() * keyValues.length) + 1;
		for (let i = 0; i < numberOfDeletion; i += 1) {
			const randomKey =
				keyValues[Math.floor(Math.random() * keyValues.length)];
			newItem[randomKey] = undefined;
		}
		return newItem;
	});
}

const canvasGradient = createVerticalLinearGradient([
	{ stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
	{ stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
	{ stop: 1, color: hexToRGBA("#4286f4", 0.8) },
]);


let AreaChart = props => {
	let { chartData: initialData } = props;
	// remove some of the data to be able to see
	// the tooltip resize
	initialData = removeRandomValues(initialData).map(d => ({
		...d,
		date: new Date(d.date),
	}));

	const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
		d => d.date
	);
	const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
		initialData
	);

	const start = xAccessor(last(data));
	const end = xAccessor(data[Math.max(0, data.length - 150)]);
	const xExtents = [start, end];

	const [ref, { width, height }] = useDimensions();

	return (
		<div ref={ref}>
			<h3></h3>
		<ChartCanvas ratio={props.ratio} width={width || props.width} height={200}
			margin={{ left: 16, right: 16, top: 20, bottom: 30 }}
			seriesName="MSFT"
			data={data} type={"svg"}
			xAccessor={xAccessor}
			xScale={xScale}
			displayXAccessor={displayXAccessor}
			xExtents={xExtents}
			mouseMoveEvent={false}
			panEvent={false}
			zoomEvent={false}
			clamp={false}
		>
			<Chart id={1} yExtents={d => [d.high, d.low]} height={150}>
				<defs>
					<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
						<stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
						{/* <stop offset="70%" stopColor="#6fa4fc" stopOpacity={0.4} /> */}
						{/* <stop offset="100%"  stopColor="#4286f4" stopOpacity={0.8} /> */}
						<stop offset="100%"  stopColor="#fff" stopOpacity={0.8} />
					</linearGradient>
				</defs>
				<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
				<YAxis axisAt="right" orient="left" showTicks={false} ticks={1} />
				<AreaSeries
					yAccessor={d => d.close}
					fill="url(#MyGradient)"
					strokeWidth={2}
					interpolation={curveMonotoneX}
					canvasGradient={canvasGradient}
				/>
				{/* <EdgeIndicator
					itemType="last"
					orient="right"
					edgeAt="right"
					yAccessor={d => d.close}
					fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
				/> */}
				<HoverTooltip
					yAccessor={xAccessor()}
					tooltipContent={tooltipContent([])}
					fontSize={15}
				/>
			</Chart>
			<Chart id={2} origin={(w, h) => [0, h - 50]} height={50} yExtents={d => d.volume}>
				<YAxis axisAt="left" orient="left" showTicks={false} ticks={1} tickFormat={format(".2s")}/>
				<BarSeries yAccessor={d => d.volume} stroke={false} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
			</Chart>
		</ChartCanvas>
		</div>
	);
}


// AreaChart.propTypes = {
// 	data: PropTypes.array.isRequired,
// 	width: PropTypes.number.isRequired,
// 	ratio: PropTypes.number.isRequired,
// 	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
// };

// AreaChart.defaultProps = {
// 	type: "svg",
// };
AreaChart = fitWidth(AreaChart);

export default AreaChart;