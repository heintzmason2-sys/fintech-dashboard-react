import {  useContext, useState, useEffect } from "react";
import DashboardContext from "./DashboardContext";

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

const popularCrypto = [
    { symbol: "BTC", description: "Bitcoin" },
    { symbol: "SOL", description: "Solana" },
    { symbol: "ETH", description: "Ethereum" },
    { symbol: "BNB", description: "BNB" },
    { symbol: "XRP", description: "XRP" },
    { symbol: "DOGE", description: "Dogecoin" },
    { symbol: "ADA", description: "Cardano" },
    { symbol: "AVAX", description: "Avalanche" }
];

function CryptoOverview({ cryptoResults, hasSearched }){
    console.log("Crypto Results:", cryptoResults);
    const settings = useContext(DashboardContext)
    const [cryptoData, setCryptoData] = useState([]);
    const [showMore, setShowMore] = useState(false);
    console.log("showMore state:", showMore);
  useEffect(() => {
    const assets = hasSearched
        ? cryptoResults
        : showMore
            ? popularCrypto
            : popularCrypto.slice(0, 4);
    console.log("Assets:", assets);

    if (assets.length === 0) {
        setCryptoData([]);
        return;
    }

    Promise.all(
        assets.map(crypto =>
            fetch(`http://localhost:3000/api/crypto/${crypto.symbol}`)
                .then(response => response.json())
        )
    )
        .then(data => {
            console.log("Crypto API Data:", data);

            const formattedCrypto = data.map((crypto, index) => ({
                symbol: assets[index].symbol,
                name: assets[index].description,
                price: crypto.c != null
                    ? `$${crypto.c.toFixed(2)}`
                    : "N/A",
                change: crypto.dp != null
                    ? `${crypto.dp >= 0 ? "+" : ""}${crypto.dp.toFixed(2)}%`
                    : "N/A"
            }));

            setCryptoData(formattedCrypto);
        })
        .catch(error => console.error(error));

}, [cryptoResults, hasSearched, showMore]);
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
           <button onClick={() => {
            console.log("VIEW MORE CLICKED");
            setShowMore(!showMore)

           }}>
           {showMore ? "View Less" : "View More"}
           </button>
        </div>
    )
}

export default CryptoOverview