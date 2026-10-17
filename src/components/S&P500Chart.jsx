import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';


function SP500Chart({ interval }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
    async function fetchMarketData() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:3000/api/market/sp500?interval=${interval}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch S&P 500 data");
            }

            const result = await response.json();

            setData(result.data);
        } catch (err) {
            console.error("S&P 500 fetch error:", err);
            setError("Unable to load market data.");
        } finally {
            setLoading(false);
        }
    }

    fetchMarketData();
}, [interval]);
if (loading) {
    return <p>Loading market data...</p>;
}

if (error) {
    return <p>{error}</p>
}
const xTicks = (() => {
    if (interval === "1M") {
        const selectedTicks = [];
        let lastTime = -Infinity;
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        for (const point of data) {
            if (point.time - lastTime >= oneWeek) {
                selectedTicks.push(point.time);
                lastTime = point.time;
            }
        }

        return selectedTicks;
    }

    if (interval === "3M") {
        const selectedTicks = [];
        let previousMonth = "";

        for (const point of data) {
            const date = new Date(point.time);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            if (monthKey !== previousMonth) {
                selectedTicks.push(point.time);
                previousMonth = monthKey;
            }
        }

        return selectedTicks;
    }

    return undefined;
})();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid stroke="#333" />

                <XAxis
    dataKey="time"
    ticks={xTicks}
    interval="preserveStartEnd"
    tickMargin={8}
    padding={{left: 10, right: 10}}

    minTickGap={40}
    tickFormatter={(timestamp) => {
        const date = new Date(timestamp);

        if (interval === "1D") {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
            });
        }

        if (interval === "1W") {
            return date.toLocaleDateString("en-US", {
                weekday: "short"
            });
        }

        if (interval === "1M") {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        }

        if (interval === "3M") {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        }

        if (interval === "1Y" || interval === "ALL") {
            return date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit"
            });
        }

        return "";
    }}
/>
                <YAxis
    domain={["auto", "auto"]}
    tickFormatter={(value) => {
        const number = Number(value);

        return Number.isFinite(number)
            ? Math.round(number).toLocaleString("en-US")
            : "";
    }}
/>
                <Tooltip />

                <Line
    type="monotone"
    dataKey="value"
    stroke={
        data.length > 1 &&
        data[data.length - 1].value < data[0].value
            ? "#ef4444"
            : "#22c55e"
    }
    strokeWidth={2}
    dot={false}
/>
            </LineChart>
        </ResponsiveContainer>
    );
}

export default SP500Chart;