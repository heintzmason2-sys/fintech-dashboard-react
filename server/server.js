import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: ".env.local" });


const app = express();
app.use(cors())
const PORT = 3000;
app.get('/api/stocks/:symbol', async (req, res) => {
    const symbol = req.params.symbol;

    const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
})

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
})

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})