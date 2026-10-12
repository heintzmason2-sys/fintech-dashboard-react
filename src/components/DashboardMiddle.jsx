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

useEffect(() => {
    async function fetchMovers() {
        try {
            const response = await fetch(
                "http://localhost:3000/api/market-movers"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch market movers");
            }

            const result = await response.json();

            setMovers(result.data);
        } catch (error) {
            console.error("Error fetching market movers:", error);
        }
    }

    fetchMovers();
}, []);

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
                    <strong>5,634.61</strong>
                    <span>+25.15 (0.45%)</span>
                </div>
                <div className="time-ranges">
                    <button>1D</button>
                    <button>1W</button>
                    <button>1M</button>
                    <button>3M</button>
                    <button>1Y</button>
                    <button>All</button>
                </div>
                <div className="chart-area">
                    <SP500Chart />
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
            <PortfolioSummary />
        </div>
    )
}

export default DashboardMiddle