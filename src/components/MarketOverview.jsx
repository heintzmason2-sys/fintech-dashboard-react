import MarketIndexCard from "./MarketIndexCard";
import './MarketOverview.css'

const markets = [
    {name: 'S&P 500', value: '5,634.61', change: '+0.45%'},
    {name: 'NASDAQ', value: '17,722.03', change: '+0.61%'},
    {name: 'DOW JONES', value: '41,175.08', change: '+0.24%'},
    {name: 'VIX', value: '16.41', change: '-2.49%'}
]
function MarketOverview(){
    return(
        <section className="market-overview">
            {markets.map((market)=>(
                <MarketIndexCard
                key={market.name}
                name={market.name}
                value={market.value}
                change={market.change}
                />
            ))}
        </section>
    )
}

export default MarketOverview