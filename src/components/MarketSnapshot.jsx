import MarketCard from './MarketCard'
import './MarketSnapshot.css'
import { useState, useEffect } from 'react'



function MarketSnapshot({ searchText, searchResults, hasSearched }) {
  const [stocks, setStocks] = useState([]);
  const symbols = ["AAPL", "TSLA", "NVDA", "MSFT"]
 useEffect(() => {
    let cancelled = false
    setStocks([])
    const stockResults = searchResults.filter(result => result.type === "Common Stock");
    const symbolsToFetch = hasSearched
    ? searchResults.map(result => result.symbol)
    : symbols
    Promise.all(
        symbolsToFetch.map(symbol =>
            fetch(`http://localhost:3000/api/stocks/${symbol}`)
                .then(response => response.json())
        )
    )
        .then(data => {
            if (cancelled) return
            console.log("ALL API DATA:", data);
            data.forEach((stock, index)=>{
                console.log("STOCK", index, stock)
            })

            const formattedStocks = data.map((stock, index) => ({
                symbol: symbolsToFetch[index],
                price: stock.c != null ? `$${stock.c.toFixed(2)}` : "N/A",
                change: stock.d != null && stock.dp != null
                ? `${stock.d >= 0 ? "+" : ""}${stock.d.toFixed(2)} (${stock.dp.toFixed(2)}%)`
                : "N/A"
            }));

            setStocks(formattedStocks);
        })
        .catch(error => console.error(error));
        return () => {
            cancelled = true
        }
}, [searchResults]);
        const filteredStocks = stocks

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