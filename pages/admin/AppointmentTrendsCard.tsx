import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface AppointmentTrendsCardProps {
    data: { name: string; count: number }[]
}

const AppointmentTrendsCard: React.FC<AppointmentTrendsCardProps> = ({
    data,
}) => {
    return (
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    Appointment Trends
                </h3>
                <select className="bg-slate-50 dark:bg-slate-900 border-none text-sm text-slate-600 dark:text-slate-300 rounded-md py-1 px-3 focus:ring-0 cursor-pointer">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0f6d75" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0f6d75" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#0f6d75"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default AppointmentTrendsCard
