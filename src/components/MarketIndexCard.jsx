function MarketIndexCard({ name, value, change }){
    return (
        <div className="market-index-card">
            <span className="market-name">{name}</span>
            <strong className="market-value">{value}</strong>
            <p className={change.startsWith('+') ? 'market-change up' : 'market-change down'}>
                {change}
                </p>
        </div>
    )
}

export default MarketIndexCard