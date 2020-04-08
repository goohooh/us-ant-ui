import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Posts from '../components/Posts';
import AreaChart from '../components/AreaChart';
import { timeParse } from "d3-time-format";
import { tsvParse } from  "d3-dsv";
import withData from '../hoc/apolloClient';

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

const Index = ({ chartData, stock }) => {
    return (
        <Layout stock={stock}>
            <AreaChart chartData={chartData}  />
            <Posts />
        </Layout>
    )
}

Index.getInitialProps = async function({ query }) {
    const symbol = query.symbol ? query.symbol : "spy"
    const range = query.range ? query.range : "3m"
    const chartData = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/chart/${range}?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
    const stock = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
    
    return {
        chartData,
        stock,
    };
};

export default Index;