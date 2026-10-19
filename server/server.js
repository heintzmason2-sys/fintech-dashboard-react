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

// Shared in-memory cache for BusinessQuant market data
const businessQuantCache = {
    data: null,
    expiresAt: 0,
    rateLimitedUntil: 0
};

// Reuse cached data until it expires
async function getBusinessQuantData() {
    const now = Date.now();
    if (businessQuantCache.rateLimitedUntil && now < businessQuantCache.rateLimitedUntil) {
        throw new Error("BusinessQuant rate limit reached. Please try again later.");

    }

    // Return cached data when it is still valid
    if (
        businessQuantCache.data &&
        now < businessQuantCache.expiresAt
    ) {
        return businessQuantCache.data;
    }

    // Fetch fresh data when the cache is empty or expired
    const params = new URLSearchParams({
        api_key: process.env.BUSINESSQUANT_API_KEY,
        bucket: "both",
        count: "25",
        min_volume: "1000000"
    });

    const response = await fetch(
        `https://data.businessquant.com/trending?${params}`
    );
    const responseText = await response.text();
    console.log("BusinessQuant status:", response.status);
    console.log("BusinessQuant response:", responseText);

    if(!response.ok) {
        // If rate-limited pause requests for 24 hours
        if(response.status === 429){
            businessQuantCache.rateLimitedUntil = Date.now() + 24 * 60 * 60 * 1000;
        }
        throw new Error(
            `BusinessQuant returned status ${response.status}: ${responseText}`
        );
    }
    const data = JSON.parse(responseText);
    // Store the response for 60 seconds
    businessQuantCache.data = data;
    businessQuantCache.expiresAt = Date.now() + 60_000;

    return data;
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

app.get("/api/market-movers", async (req, res) => {
    try {
        const result = await getBusinessQuantData();

        if (!Array.isArray(result.data)) {
            return res.status(502).json({
                error: "Invalid market movers response"
            });
        }

        const marketMovers = result.data
            .filter(mover =>
                mover.bucket === "gainer" ||
                mover.bucket === "loser"
            )
            .slice(0, 10);

        res.json({
            ...result,
            data: marketMovers
        });
    } catch (error) {
        console.error("Market Movers error:", error.message);

        res.status(502).json({
            error: "Unable to retrieve market movers"
        });
    }
});

app.get("/api/watchlist", async (req, res) => {
    try {
        const result = await getBusinessQuantData();

        if (!Array.isArray(result.data)) {
            return res.status(502).json({
                error: "Invalid watchlist response"
            });
        }

        const watchlist = [...result.data]
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 6);

        res.json(watchlist);
    } catch (error) {
        console.error("Watchlist error:", error.message);

        res.status(502).json({
            error: "Unable to retrieve watchlist"
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

// Fetch NASDAQ, Dow Jones, or VIX market data
app.get("/api/market/index/:symbol", async (req, res) => {
    // Match the requested name to its Yahoo Finance symbol
    const indices = {
        nasdaq: {
            symbol: "^IXIC",
            name: "NASDAQ Composite"
        },
        dow: {
            symbol: "^DJI",
            name: "Dow Jones"
        },
        vix: {
            symbol: "^VIX",
            name: "VIX"
        }
    };

    try {
        // 1. Identify which index the frontend requested
        const requestedIndex = req.params.symbol.toLowerCase();
        const index = indices[requestedIndex];

        // 2. Reject unsupported index names
        if (!index) {
            return res.status(400).json({
                error: "Unsupported market index",
                supportedIndices: Object.keys(indices)
            });
        }

        // 3. Build the Yahoo Finance request URL
        const url = new URL(
            `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(index.symbol)}`
        );

        url.searchParams.set("range", "5d");
        url.searchParams.set("interval", "1d");

        // 4. Request market data from Yahoo Finance
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

        // 5. Convert the response into JavaScript data
        const result = await response.json();
        const chart = result.chart?.result?.[0];

        if (!chart) {
            throw new Error(
                result.chart?.error?.description ||
                "No market data returned"
            );
        }

        // 6. Extract the current price and previous closing price
        // 6. Extract the current market price
const meta = chart.meta;
const currentPrice = meta.regularMarketPrice;

// Request daily chart metadata to get the previous close
const dailyUrl = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(index.symbol)}`
);

dailyUrl.searchParams.set("range", "1d");
dailyUrl.searchParams.set("interval", "5m");

const dailyResponse = await fetch(dailyUrl, {
    headers: {
        "User-Agent": "Mozilla/5.0"
    },
    signal: AbortSignal.timeout(10000)
});

let previousClose = null;

if (dailyResponse.ok) {
    const dailyResult = await dailyResponse.json();
    const dailyMeta = dailyResult.chart?.result?.[0]?.meta;

    if (dailyMeta) {
        previousClose = dailyMeta.chartPreviousClose;
    }
}

        // 7. Calculate the daily price movement
        const change =
            Number.isFinite(currentPrice) &&
            Number.isFinite(previousClose)
                ? currentPrice - previousClose
                : null;

        const changePercent =
            change !== null && previousClose !== 0
                ? (change / previousClose) * 100
                : null;

        // 8. Send the results to the React frontend
        res.json({
            symbol: index.symbol,
            name: index.name,
            currency: meta.currency,
            currentPrice,
            previousClose,
            change,
            changePercent
        });

    } catch (error) {
        console.error(
            "Market index data error:",
            error.message
        );

        res.status(502).json({
            error: "Unable to retrieve market index data"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})