import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { ClicksByDate } from '../types';

interface ClicksOverTimeChartProps {
    data: ClicksByDate[];
}

export default function ClicksOverTimeChart({ data }: ClicksOverTimeChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                No click activity in this time range.
            </div>
        );
    }

    const formattedData = data.map((item) => {
        try {
            const parsed = parseISO(item.date);
            return {
                ...item,
                displayDate: format(parsed, 'MMM d'),
                fullDate: format(parsed, 'EEEE, MMM d, yyyy'),
            };
        } catch {
            return {
                ...item,
                displayDate: item.date,
                fullDate: item.date,
            };
        }
    });

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const pData = payload[0].payload as { fullDate: string; count: number };
                                return (
                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl text-xs space-y-0.5 border border-slate-700/50 animate-in zoom-in-95 duration-100">
                                        <p className="text-slate-400 text-[11px] font-medium">{pData.fullDate}</p>
                                        <p className="font-bold text-sm text-indigo-300">
                                            {pData.count} <span className="font-normal text-xs text-slate-300">clicks</span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        fill="url(#clickGradient)"
                        activeDot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
