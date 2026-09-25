import Watchlist from "../WatchList"
import './DashboardMiddle.css'
import SP500Chart from "./S&P500Chart"
import MarketMover from "./MarketMover"
import CryptoOverview from "./CryptoOverview"
import MarketNews from "./MarketNews"
import PortfolioSummary from "./PortfolioSummary"
const movers = [
    { symbol: 'AAPL', change: '+2.45%' },
    { symbol: 'TSLA', change: '+1.22%' },
    { symbol: 'NVDA', change: '+2.45%' },
    { symbol: 'MSFT', change: '-0.53%' }
]
function DashboardMiddle(){
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

                {movers.map((mover)=> (
                    <MarketMover
                    key={mover.symbol}
                    symbol={mover.symbol}
                    change={mover.change}
                    />
                ))}
            </div>
            <CryptoOverview />
            <MarketNews />
            <PortfolioSummary />
        </div>
    )
}

export default DashboardMiddle