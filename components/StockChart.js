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

import { discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";
import fetch from 'isomorphic-unfetch';
import { ReactEditor } from "slate-react";

const getData = () => fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/chart/max?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
	.then(res => res.json())

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
function getMaxUndefined(calculators) {
	return calculators.map(each => each.undefinedLength()).reduce((a, b) => Math.max(a, b));
}
const LENGTH_TO_SHOW = 180;


class StockChart extends React.Component {
	constructor(props) {
		super(props);
		const { chartData: inputData } = props;
		// const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxWindowSize);
		// const dataToCalculate = inputData;

		const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

		// console.log(inputData.length, dataToCalculate.length, maxWindowSize)
		const { index } = indexCalculator(inputData);
		/* SERVER - END */

		const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.withIndex(index);
		// const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(cwalculatedData.slice(-LENGTH_TO_SHOW));
		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(inputData);

		this.state = {
			linearData,
			data: linearData,
			xScale,
			xAccessor, displayXAccessor
		};
		this.handleDownloadMore = this.handleDownloadMore.bind(this);
	}

	handleDownloadMore(start, end) {
		console.log(start, end)
		if (Math.ceil(start) === end) return;
		const { data: prevData } = this.state;
		const { data: inputData } = this.props;
		// if (inputData.length === prevData.length) return;

		const rowsToDownload = end - Math.ceil(start);

		// const maxWindowSize = getMaxUndefined([ema26,
		// 	ema12,
		// 	macdCalculator,
		// 	smaVolume50
		// ]);

		/* SERVER - START */
		const dataToCalculate = inputData
			.slice(-rowsToDownload - prevData.length, - prevData.length);

		const indexCalculator = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.indexCalculator();
		const { index } = indexCalculator(
			dataToCalculate	
				.slice(-rowsToDownload)
				.concat(prevData));
		/* SERVER - END */

		const xScaleProvider = discontinuousTimeScaleProviderBuilder()
			.initialIndex(Math.ceil(start))
			.withIndex(index);

		const { data: linearData, xScale, xAccessor, displayXAccessor } = xScaleProvider(dataToCalculate.slice(-rowsToDownload).concat(prevData));

		// console.log(linearData.length)
		setTimeout(() => {
			// simulate a lag for ajax
			this.setState({
				data: linearData,
				xScale,
				xAccessor,
				displayXAccessor,
			});
		}, 300);
	}

	render () {
		return (
			<>
			<ChartCanvas ratio={props.ratio} width={width || props.width || 320} height={200}
				margin={{ left: 16, right: 16, top: 20, bottom: 30 }}
				seriesName="MSFT"
				data={linearData} type={"svg"}
				xAccessor={xAccessor}
				xScale={xScale}
				displayXAccessor={displayXAccessor}
				onLoadMore={this.handleDownloadMore}
				// mouseMoveEvent={true}
				// panEvent={true}
				// zoomEvent={true}
				// clamp={true}
			>
				<Chart id={1} yExtents={d => [d.high, d.low]} height={150}>
					<defs>
						<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="0%" stopColor="#fff" stopOpacity={0.2} />
							<stop offset="100%"  stopColor="#fff" stopOpacity={0.8} />
						</linearGradient>
					</defs>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<AreaSeries
						yAccessor={d => d.close}
						fill="url(#MyGradient)"
						strokeWidth={2}
						interpolation={curveMonotoneX}
						canvasGradient={canvasGradient}
					/>
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
			<div className="flex flex-row-reverse px-4">
				<button className="bg-green-500 hover:bg-green-700 text-xs text-white font-bold py-1 px-3 rounded-full border border-green-700">
					공유하기	
				</button>
			</div>
			</>
		);
	}
}


export default fitWidth(StockChart);

// export default AreaChart;