

function MarketMover({ symbol, change }) {
    const isPositive = change.startsWith('+')

    return(
        <div className="market-mover">
            <span>{symbol}</span>
            <span className={isPositive ? 'up' : 'down'}>
                {change}
            </span>
        </div>
    )
}
export default MarketMover