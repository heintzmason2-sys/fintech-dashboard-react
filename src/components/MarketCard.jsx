function MarketCard({ symbol, price, change }) {
    const isPositive = change.startsWith('+');

    return (
        <div className="market-card">
            <span className="stock-symbol">{symbol}</span>
            <strong>{price}</strong>
            <small className={isPositive ? 'up' : 'down'}>
                {change}
            </small>
        </div>
    );
}

export default MarketCard;