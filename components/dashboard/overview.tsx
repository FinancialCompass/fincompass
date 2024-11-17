'use client'

import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer } from 'recharts'

const data = [
    {
        month: 'Jan',
        expenses: 4000,
        income: 5400,
        savings: 1400
    },
    {
        month: 'Feb',
        expenses: 3500,
        income: 5200,
        savings: 1700
    },
    {
        month: 'Mar',
        expenses: 4200,
        income: 5800,
        savings: 1600
    },
    {
        month: 'Apr',
        expenses: 3800,
        income: 5600,
        savings: 1800
    },
    {
        month: 'May',
        expenses: 4300,
        income: 6000,
        savings: 1700
    },
    {
        month: 'Jun',
        expenses: 4100,
        income: 5900,
        savings: 1800
    }
]

export function Overview() {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="month"
                        className="text-sm text-muted-foreground"
                    />
                    <YAxis
                        className="text-sm text-muted-foreground"
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background border rounded-lg shadow-lg p-4">
                                        <p className="font-medium mb-2">{label}</p>
                                        {payload.map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="capitalize">{item.name}:</span>
                                                <span className="font-medium">
                                                    ${item.value ? item.value.toLocaleString() : 'N/A'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "14px"
                        }}
                    />
                    <Bar
                        dataKey="expenses"
                        fill="hsl(var(--chart-1))"
                        name="Expenses"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="income"
                        fill="hsl(var(--chart-2))"
                        name="Income"
                        radius={[4, 4, 0, 0]}
                    />
                    <Line
                        type="monotone"
                        dataKey="savings"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        name="Savings"
                        dot={{ r: 4 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}