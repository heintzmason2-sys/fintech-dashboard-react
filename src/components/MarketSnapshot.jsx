import MarketCard from './MarketCard'
import './MarketSnapshot.css'

const stocks = [
  {
    symbol: "AAPL",
    price: "$316.85",
    change: "-2.85 (-0.89%)"
  },
  {
    symbol:"TSLA",
    price: "$1,024.86",
    change: "+12.34 (+1.22%)"
  },
  {
    symbol:"BTC",
    price: "$28,000.00",
    change: "-500.00 (-1.75%)"
  },
  {
    symbol:"NVDA",
    price: "$220.15",
    change: "+5.25 (+2.45%)" 
  },
  {
    symbol: "MSFT",
    price: "$280.50",
    change: "-1.50 (-.53%)"
  }
]

function MarketSnapshot({ searchText }) {
  const filteredStocks = !searchText
      ? stocks
      : stocks.filter(stock => stock.symbol.toLowerCase() === searchText.toLowerCase())

  return (
        <section>

            <aside>

            <h3 className="hero">Market Snapshot</h3>
            {filteredStocks.length === 0 && <p className='no-results'>No stocks found</p>}
            <div className="market-cards">
            {filteredStocks.map((stock) => (
                <MarketCard
                key={stock.symbol}
                symbol={stock.symbol}
                price={stock.price}
                change={stock.change}
                />
            ))}
            </div>

            </aside>

        </section>
    )
}
export default MarketSnapshot