import {  useContext } from "react";
import DashboardContext from "./DashboardContext";

const cryptoData = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        price: "$64,892.21",
        change: "+2.35%"
    },
    {
        symbol: "SOL",
        name: "Solana",
        price: "$148.73",
        change: "+3.21%"
    },
    {
        symbol: "BNB",
        name: "BNB",
        price: "$587.11",
        change: "+1.45%"
    },
    {
        symbol: "XRP",
        name: "XRP",
        price: "$0.6123",
        change: "+0.78%"
    }
]

function CryptoItem({ symbol, name, price, change}) {
    
    return(
        <div className="crypto-item">
            <div className="crypto-identity">
                <strong className="crypto-symbol">{symbol}</strong>
                <p>{name}</p>
            </div>

            <p>{price}</p>
            <p className={change.startsWith("+")? 'up' : 'down'}>
                {change}
            </p>
        </div>
    )
}

function CryptoOverview(){
    const settings = useContext(DashboardContext)
    return(
        <div className="crypto-overview dashboard-card">
            <h2>Crypto Overview</h2>
            <p>Currency: {settings.currency}</p>
            {cryptoData.map((crypto)=>(
                <CryptoItem
                key={crypto.symbol}
                symbol={crypto.symbol}
                name={crypto.name}
                price={crypto.price}
                change={crypto.change}
                />
            ))}
        </div>
    )
}

export default CryptoOverview