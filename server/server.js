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

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})