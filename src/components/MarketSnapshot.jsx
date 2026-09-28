import MarketCard from './MarketCard'
import './MarketSnapshot.css'
import { useState, useEffect } from 'react'



function MarketSnapshot({ searchText }) {
  const [stocks, setStocks] = useState([]);
  const symbols = ["AAPL", "TSLA", "NVDA", "MSFT"]
 useEffect(() => {
    Promise.all(
        symbols.map(symbol =>
            fetch(`http://localhost:3000/api/stocks/${symbol}`)
                .then(response => response.json())
        )
    )
        .then(data => {
            console.log("ALL API DATA:", data);

            const formattedStocks = data.map((stock, index) => ({
                symbol: symbols[index],
                price: `$${stock.c.toFixed(2)}`,
                change: `${stock.d >= 0 ? "+" : ""}${stock.d.toFixed(2)} (${stock.dp.toFixed(2)}%)`
            }));

            setStocks(formattedStocks);
        })
        .catch(error => console.error(error));
}, []);
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