import Watchlist from "../WatchList"
import './DashboardMiddle.css'
import SP500Chart from "./S&P500Chart"
import CryptoOverview from "./CryptoOverview"
import MarketNews from "./MarketNews"
import PortfolioSummary from "./PortfolioSummary"
import {useEffect, useState} from "react"


function DashboardMiddle({ cryptoResults, hasSearched }){
    const [movers, setMovers] = useState([]);
    const [activeTab, setActiveTab] = useState("gainers");
    const [selectedInterval, setSelectedInterval] = useState("1D");
    const [marketSummary, setMarketSummary] = useState(null);
    const [marketSummaryError, setMarketSummaryError] = useState("");

useEffect(() => {
    async function fetchMovers() {
        console.log("Fetching BusinessQuant market movers...");
        try {
            const response = await fetch(
                "http://localhost:3000/api/market-movers"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch market movers");
            }

            const result = await response.json();
            console.log("Business Quant Data:", result);
            console.log("First stock:", result.data[0]);

            setMovers(result.data);
        } catch (error) {
            console.error("Error fetching market movers:", error);
        }
    }

    fetchMovers();
}, []);

useEffect(() => {
    async function fetchMarketSummary() {
        try {
            setMarketSummaryError("");

            const response = await fetch(
                `http://localhost:3000/api/market/sp500?interval=${selectedInterval}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch S&P 500 summary");
            }

            const result = await response.json();

            setMarketSummary(result);
        } catch (error) {
            console.error("S&P 500 summary error:", error);

            setMarketSummaryError(
                "Unable to load S&P 500 market data."
            );
        }
    }

    fetchMarketSummary();
}, [selectedInterval]);

const filteredMovers = movers.filter(
    (mover) => mover.bucket === (
        activeTab === "gainers" ? "gainer" : "loser"
    )
);
    

    return(
        <div className="dashboard-middle">
            <Watchlist />

            <div className="market-chart dashboard-card">
                <h2>S&P 500</h2>

                <div className="chart-header">
                    <strong>
        {marketSummary
            ? marketSummary.currentPrice?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            : "Loading..."}
    </strong>

    {marketSummary && (
        <span
            className={
                marketSummary.change < 0 ? "down" : "up"
            }
        >
            {marketSummary.change > 0 ? "+" : ""}
            {marketSummary.change?.toFixed(2)}
            {" ("}
            {marketSummary.changePercent?.toFixed(2)}
            {"%)"}

        </span>
    
    )}

    {marketSummaryError && (
        <span>{marketSummaryError}</span>
    )}
                </div>



                <div className="time-ranges">
                    {["1D", "1W", "1M", "3M", "1Y"].map((interval)=>(
                        <button
                            key={interval}
                            className={selectedInterval === interval ? "active": ""}
                            onClick={() => setSelectedInterval(interval)}
                        >
                            {interval}

                        </button>
                    ))}
                </div>
                <div className="chart-area">
                    <SP500Chart interval={selectedInterval} />
                </div>
            </div>

            <div className="market-movers dashboard-card">
    <h2>Market Movers</h2>

    <div className="market-movers-tabs">
        <button
            className={activeTab === "gainers" ? "active" : ""}
            onClick={() => setActiveTab("gainers")}
        >
            Top Gainers
        </button>

        <button
            className={activeTab === "losers" ? "active" : ""}
            onClick={() => setActiveTab("losers")}
        >
            Top Losers
        </button>
    </div>

    <div className="market-movers-list">
        {filteredMovers.map((mover) => (
            <div className="market-mover-row" key={mover.ticker}>
                <div className="market-mover-info">
                    <strong>{mover.ticker}</strong>
                    <span>{mover.name_short}</span>
                </div>

                <div className="market-mover-price">
                    <strong>${Number(mover.price).toFixed(2)}</strong>

                    <span className={mover.pricechange_pct >= 0 ? "up" : "down"}>
                        {mover.pricechange_pct >= 0 ? "+" : ""}
                        {Number(mover.pricechange_pct).toFixed(2)}%
                    </span>
                </div>
            </div>
        ))}
    </div>
</div>
            <CryptoOverview 
            cryptoResults={cryptoResults}
            hasSearched={hasSearched}
            />
            <MarketNews />
            <section id="portfolio-summary">
                <PortfolioSummary />
            </section>
        </div>
    )
}

export default DashboardMiddle