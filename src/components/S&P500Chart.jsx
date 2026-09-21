import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const data = [
    { time: '9:30', value: 5600 },
    { time: '10:00', value: 5615 },
    { time: '10:30', value: 5608 },
    { time: '11:00', value: 5625 },
    { time: '11:30', value: 5618 },
    { time: '12:00', value: 5635 },
    { time: '12:30', value: 5628 },
    { time: '1:00', value: 5640 },
    { time: '1:30', value: 5634 },
    { time: '2:00', value: 5645 },
    { time: '2:30', value: 5638 },
    { time: '3:00', value: 5650 }
]

function SP500Chart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default SP500Chart