"use client";

import { ResponsiveContainer, PieChart as PC, Pie, Legend, Cell, Tooltip } from "recharts";

export default function PieChart({ data }) {
    // const total = data.map((x) => x.value).reduce((x, y) => x + y);
    const colors = ["#00d1b2", "#1dcf6f", "#e5d270", "#e6753d", "#d62d48", "#5f2899", "#008bdb"];

    return (
        <ResponsiveContainer width="100%" height={400} className="mb-4">
            <PC>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="id"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <text
                                x={x}
                                y={y}
                                fill="black"
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Legend
                    verticalAlign="top"
                    formatter={(value) => (
                        <span style={{ color: "var(--text-color)" }}>{value}</span>
                    )}
                />
                <Tooltip />
            </PC>
        </ResponsiveContainer>
    );
}
