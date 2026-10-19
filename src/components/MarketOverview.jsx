import { useEffect, useState } from "react";
import MarketIndexCard from "./MarketIndexCard";
import "./MarketOverview.css";

function MarketOverview() {
    // Store data for all four market indices
    const [marketsData, setMarketsData] = useState({
        sp500: null,
        nasdaq: null,
        dow: null,
        vix: null
    });

    // Track which indices failed to load
    const [errors, setErrors] = useState({});

    // Fetch market data when the component loads
    useEffect(() => {
        async function fetchMarketData() {
            // Each object connects an index to its backend endpoint
            const endpoints = {
                sp500: "http://localhost:3000/api/market/sp500?interval=1D",
                nasdaq: "http://localhost:3000/api/market/index/nasdaq",
                dow: "http://localhost:3000/api/market/index/dow",
                vix: "http://localhost:3000/api/market/index/vix"
            };

            // Fetch all four indices concurrently
            const results = await Promise.all(
                Object.entries(endpoints).map(async ([key, url]) => {
                    try {
                        const response = await fetch(url);

                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${key}`);
                        }

                        const data = await response.json();

                        // Return the index name and its data
                        return [key, data, null];
                    } catch (err) {
                        console.error(`${key} fetch error:`, err);

                        // Return the error for this particular index
                        return [key, null, true];
                    }
                })
            );

            // Organize the responses into objects React can use
            const updatedData = {};
            const updatedErrors = {};

            results.forEach(([key, data, error]) => {
                updatedData[key] = data;
                updatedErrors[key] = error;
            });

            setMarketsData(updatedData);
            setErrors(updatedErrors);
        }

        fetchMarketData();
    }, []);

    // Format a market index price for display
    function formatPrice(data, key) {
        if (errors[key]) {
            return "Unavailable";
        }

        if (!data) {
            return "Loading...";
        }

        return data.currentPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Format the daily percentage change
    function formatChange(data, key) {
        if (errors[key] || data?.changePercent == null) {
            return "";
        }

        const change = data.changePercent;

        return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    }

    // Prepare the data for our market cards
    const markets = [
        {
            name: "S&P 500",
            key: "sp500"
        },
        {
            name: "NASDAQ",
            key: "nasdaq"
        },
        {
            name: "DOW JONES",
            key: "dow"
        },
        {
            name: "VIX",
            key: "vix"
        }
    ];

    return (
        <section className="market-overview">
            {markets.map((market) => (
                <MarketIndexCard
                    key={market.key}
                    name={market.name}
                    value={formatPrice(marketsData[market.key], market.key)}
                    change={formatChange(marketsData[market.key], market.key)}
                />
            ))}
        </section>
    );
}

export default MarketOverview;