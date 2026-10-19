import './Watchlist.css'
import { useEffect, useState } from "react"


function Watchlist(){
    const [watchlist, setWatchlist] = useState([]);
    const [logos, setLogos] = useState({});
    useEffect(()=> {
        async function fetchWatchlist(){
            try {
                const response = await fetch(
                    "http://localhost:3000/api/watchlist"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch watchlist");
                }
                const result = await response.json();
                setWatchlist(result);
            } catch (error){
                console.error("Error fetching watchlist:", error);
            }
        }
        fetchWatchlist();
    }, []);

    useEffect(() => {
    async function fetchLogos() {
        try {
            const logoPromises = watchlist.map(async (stock) => {
                const response = await fetch(
                    `http://localhost:3000/api/stock-profile/${stock.ticker}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch logo for ${stock.ticker}`);
                }

                const profile = await response.json();

                return {
                    ticker: stock.ticker,
                    logo: profile.logo
                };
            });

            const results = await Promise.all(logoPromises);

            const logoMap = {};

            results.forEach((stock) => {
                logoMap[stock.ticker] = stock.logo;
            });

            setLogos(logoMap);

        } catch (error) {
            console.error("Error fetching logos:", error);
        }
    }

    if (watchlist.length > 0) {
        fetchLogos();
    }
}, [watchlist]);
    return(
        <section id='watchlist' className='watchlist dashboard-card'>
            <h2 className="watchlist-title">My Watchlist</h2>
            {watchlist.map((stock) => (
    <div className="watchlist-item" key={stock.ticker}>
        <div className="watchlist-stock-identity">
           <div className="watchlist-logo">
    {logos[stock.ticker] ? (
        <img
            src={logos[stock.ticker]}
            alt={`${stock.name_short} logo`}
            className="watchlist-company-logo"
        />
    ) : (
        stock.ticker.slice(0, 1)
    )}
</div>

            <div className="watchlist-stock-info">
                <strong className="stock-symbol">
                    {stock.ticker}
                </strong>

                <span className="stock-name">
                    {stock.name_short}
                </span>
            </div>
        </div>

        <div className="watchlist-stock-price">
            <strong className="stock-price">
                ${Number(stock.price).toFixed(2)}
            </strong>

            <span className={stock.pricechange_pct >= 0 ? "up" : "down"}>
                {stock.pricechange_pct >= 0 ? "+" : ""}
                {Number(stock.pricechange_pct).toFixed(2)}%
            </span>
        </div>
    </div>
))}
        </section>
    )
}

export default Watchlist;