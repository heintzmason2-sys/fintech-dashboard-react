import "./PortfolioSummary.css"
const portfolio ={
    value: "$24,580.42",
    dailyChange: "+$342.18",
    return: "+12.45%",
    buyingPower: "$8,420.15"
}
export default function PortfolioSummary(){
    return(
        <section className="portfolio-summary dashboard-card">
            <h2>Portfolio Summary</h2>
            <div className="portfolio-value">
                <span>Portfolio Value</span>
                <strong>{portfolio.value}</strong>
            </div>
            <div className="portfolio-stat">
    <span>Today's Gain/Loss</span>
    <strong>{portfolio.dailyChange}</strong>
</div>

<div className="portfolio-stat">
    <span>Overall Return</span>
    <strong>{portfolio.return}</strong>
</div>

<div className="portfolio-stat">
    <span>Buying Power</span>
    <strong>{portfolio.buyingPower}</strong>
</div>
        </section>
    )
}