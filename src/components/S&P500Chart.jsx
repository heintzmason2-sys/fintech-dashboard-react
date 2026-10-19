import { useState, useEffect } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function SP500Chart({ interval }) {
    // Store the historical market data
    const [data, setData] = useState([]);

    // Track loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch market data whenever the selected interval changes
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

    // Display a loading message while fetching data
    if (loading) {
        return <p>Loading market data...</p>;
    }

    // Display an error if the request fails
    if (error) {
        return <p>{error}</p>;
    }

    // Calculate appropriate X-axis ticks for longer intervals
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

                const monthKey =
                    `${date.getFullYear()}-${date.getMonth()}`;

                if (monthKey !== previousMonth) {
                    selectedTicks.push(point.time);
                    previousMonth = monthKey;
                }
            }

            return selectedTicks;
        }

        return undefined;
    })();

    // Format dates displayed on the X-axis
    function formatXAxis(timestamp) {
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

        if (
            interval === "1M" ||
            interval === "3M"
        ) {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        }

        if (
            interval === "1Y" ||
            interval === "All"
        ) {
            return date.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit"
            });
        }

        return "";
    }

    // Format prices with commas and two decimal places
    function formatPrice(value) {
        const number = Number(value);

        return Number.isFinite(number)
            ? number.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            : "";
    }

    // Format the date shown at the top of the tooltip
    function formatTooltipDate(timestamp) {
        const date = new Date(Number(timestamp));

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        if (interval === "1D") {
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            });
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    // Determine whether the chart is trending upward or downward
    const isTrendingDown =
        data.length > 1 &&
        data[data.length - 1].value < data[0].value;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid stroke="#333" />

                {/* Horizontal axis: display readable dates and times */}
                <XAxis
                    dataKey="time"
                    ticks={xTicks}
                    interval="preserveStartEnd"
                    tickMargin={8}
                    padding={{ left: 10, right: 10 }}
                    minTickGap={40}
                    tickFormatter={formatXAxis}
                />

                {/* Vertical axis: display rounded market values */}
                <YAxis
                    domain={["auto", "auto"]}
                    tickFormatter={(value) => {
                        const number = Number(value);

                        return Number.isFinite(number)
                            ? Math.round(number).toLocaleString("en-US")
                            : "";
                    }}
                />

                {/* Tooltip: readable timestamp and formatted price */}
                <Tooltip
                    labelFormatter={formatTooltipDate}
                    formatter={(value) => [
                        formatPrice(value),
                        "S&P 500"
                    ]}
                    contentStyle={{
                        backgroundColor: "#151515",
                        border: "1px solid #d6a832",
                        borderRadius: "8px",
                        color: "#ffffff"
                    }}
                    labelStyle={{
                        color: "#f5c451",
                        marginBottom: "4px"
                    }}
                />

                {/* Market price line */}
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isTrendingDown ? "#ef4444" : "#22c55e"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                        r: 5,
                        stroke: "#f5c451",
                        strokeWidth: 2
                    }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default SP500Chart;