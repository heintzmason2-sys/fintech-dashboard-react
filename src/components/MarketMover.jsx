

function MarketMover({ symbol, change }) {
    const isPositive = change.startsWith('+')

    return(
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
                    <strong>
                        ${Number(mover.price).toFixed(2)}
                    </strong>

                    <span className={mover.pricechange_pct >= 0 ? "up" : "down"}>
                        {mover.pricechange_pct >= 0 ? "+" : ""}
                        {Number(mover.pricechange_pct).toFixed(2)}%
                    </span>
                </div>
            </div>
        ))}
    </div>
</div>
    )
}
export default MarketMover