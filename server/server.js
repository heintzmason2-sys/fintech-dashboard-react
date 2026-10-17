import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: ".env.local" });

const cryptoSymbols = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    BNB: "BNB",
    XRP: "XRP",
    DOGE: "Dogecoin",
    ADA: "Cardano",
    AVAX: "Avalanche"
}

const app = express();
app.use(cors())
const PORT = 3000;
app.get('/api/stocks/:symbol', async(req, res)=> {
    const symbol = req.params.symbol
    const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data)
});

app.get('/api/stocks/:symbol/candle', async(req,res)=>{
    const symbol = req.params.symbol

    const now = new Date();
    now.setHours(9,30,0,0)

    const from = Math.floor(now.getTime() / 1000);
    const to = Math.floor(Date.now() / 1000)

    const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=5&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`
    )
    const data = await response.json();
    console.log(data)
    res.json(data);
})

app.get('/api/search', async(req, res)=>{
    const query = req.query.q;
    const crypto = cryptoSymbols[query.toUpperCase()];
    if (crypto) {
        return res.json({
            result: [{
                symbol: query.toUpperCase(),
                description: crypto,
                type: "Crypto"
            }]
        })
    }
    const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${query}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json()
    res.json(data);
})

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
})

app.get('/api/crypto/:symbol', async(req, res)=>{
    const symbol = req.params.symbol;
    const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=BINANCE:${symbol}USDT&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    console.log(data);
    res.json(data);
})

app.get('/api/market-news', async(req, res)=> {
    const response = await fetch(
        `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
})

app.get("/api/market-movers", async (req, res)=> {
    try{
        const params = new URLSearchParams({
            api_key: process.env.BUSINESSQUANT_API_KEY,
            bucket: "both",
            count: "5",
            min_volume: "1000000"
        });
        const response = await fetch(
            `https://data.businessquant.com/trending?${params}`
        );
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        res.json(data);
    } catch (error) {
        console.error("Market Movers error:", error);
        res.status(500).json({
            error: "Failed to fetch market movers"
        });
    }
});

app.get("/api/watchlist", async (req, res) => {
    try {
        const params = new URLSearchParams({
            api_key: process.env.BUSINESSQUANT_API_KEY,
            bucket: "both",
            count: "25",
            min_volume: "1000000"
        });
        const response = await fetch(
            `https://data.businessquant.com/trending?${params}`
        );
        const result = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(result);
        }
        const watchlist = result.data
            .sort((a, b)=> b.volume - a.volume)
            .slice(0, 6)
        console.log("Watchlist stock fields:", Object.keys(watchlist[0]));
        res.json(watchlist);
    } catch (error) {
        console.error("Watchlist error:", error);
        res.status(500).json({
            error: "Failed to fetch watchlist"
        });
    }
});

app.get('/api/stock-profile/:symbol', async (req, res)=> {
    try {
        const symbol = req.params.symbol;
        const response = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
        );
        const data = await response.json();
        if (!response.ok){
            return res.status(response.status).json(data)
        }
        res.json(data)
    } catch(error) {
        console.error("Stock profile error:", error);
        res.status(500).json({error: "Failed to fetch stock profile"});
    }
});

app.get("/api/market/sp500", async (req, res) => {
    try {
        // 1. Define the available time intervals
        const intervals = {
            "1D": { range: "1d", interval: "5m" },
            "1W": { range: "5d", interval: "30m" },
            "1M": { range: "1mo", interval: "1d" },
            "3M": { range: "3mo", interval: "1d" },
            "1Y": { range: "1y", interval: "1wk" },
            "All": { range: "max", interval: "1mo" }
        };

        // 2. Read the selected interval from the request
        const selectedInterval = req.query.interval || "1D";
        const settings = intervals[selectedInterval];

        // 3. Validate the requested interval
        if (!settings) {
            return res.status(400).json({
                error: "Invalid interval",
                supportedIntervals: Object.keys(intervals)
            });
        }

        // 4. Build the Yahoo Finance request URL
        const url = new URL(
            "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC"
        );

        url.searchParams.set("range", settings.range);
        url.searchParams.set("interval", settings.interval);

        // 5. Request historical S&P 500 data
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(
                `Yahoo Finance returned status ${response.status}`
            );
        }

        const result = await response.json();
        const chartResult = result.chart?.result?.[0];

        if (!chartResult) {
            throw new Error(
                result.chart?.error?.description ||
                "No S&P 500 data returned"
            );
        }

        // 6. Extract the historical timestamps and closing prices
        const timestamps = chartResult.timestamp || [];
        const prices =
            chartResult.indicators?.quote?.[0]?.close || [];

        const data = timestamps
            .map((timestamp, index) => ({
                time: timestamp * 1000,
                value: prices[index]
            }))
            .filter(
                (point) =>
                    point.value !== null &&
                    Number.isFinite(point.value)
            );

        // 7. Extract current market information
       const meta = chartResult.meta;
const currentPrice = meta.regularMarketPrice;

// Use the latest two daily closing prices to calculate today's change,
// regardless of which historical interval is selected.
const dailyUrl = new URL(
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC"
);
dailyUrl.searchParams.set("range", "1d");
dailyUrl.searchParams.set("interval", "5m");

const dailyResponse = await fetch(dailyUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10000)
});

let previousClose = null;
console.log("Daily response previous close will be checked");
if (dailyResponse.ok) {
    const dailyResult = await dailyResponse.json();
    const dailyMeta = dailyResult.chart?.result?.[0]?.meta;

    if (dailyMeta) {
    console.log("Daily chart metadata:", dailyMeta);
    console.log("Daily chart previous close:", dailyMeta.chartPreviousClose);

    previousClose = dailyMeta.chartPreviousClose;
}
}

const change =
    Number.isFinite(currentPrice) && Number.isFinite(previousClose)
        ? currentPrice - previousClose
        : null;
console.log("Final market summary:", {
    currentPrice,
    previousClose,
    change
});
const changePercent =
    change !== null && previousClose !== 0
        ? (change / previousClose) * 100
        : null;

        // 8. Send the data to the React frontend
        res.json({
            symbol: "^GSPC",
            name: "S&P 500",
            interval: selectedInterval,
            currency: meta.currency,
            currentPrice,
            previousClose,
            change,
            changePercent,
            data
        });

    } catch (error) {
        console.error(
            "S&P 500 market data error:",
            error.message
        );

        res.status(502).json({
            error: "Unable to retrieve S&P 500 market data"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})