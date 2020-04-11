import fetch from 'isomorphic-unfetch';
import Layout from '../components/Layout';
import Posts from '../components/Posts';
import AreaChart from '../components/AreaChart';

const Index = ({ chartData, stock }) => {
    const gap = stock.latestPrice - stock.previousClose;
    const up = gap > 0;
    return (
        <Layout stock={stock}>
            <div className="container px-4 pt-1 flex">
                <h3 className="mr-2 text-xl">{stock.latestPrice}$</h3>
                <span className={"text-base " +  
                    (up ? "text-blue-700" : "text-red-600")
                } dangerouslySetInnerHTML={{__html: `${up ? "&#9650;" : "&#9660;"} ${gap.toFixed(2)}$ ${(gap / stock.latestPrice * 100).toFixed(2)}%`}}></span>
            </div>
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