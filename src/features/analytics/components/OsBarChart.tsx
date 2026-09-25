import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { ClicksByOs } from '../types';

interface OsBarChartProps {
    data: ClicksByOs[];
}

const OS_COLORS = [
    '#6366f1', // Indigo
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#64748b', // Slate
];

export default function OsBarChart({ data }: OsBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                No operating system data available.
            </div>
        );
    }

    const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
    const totalClicks = sortedData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="os"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        width={80}
                    />
                    <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const pData = payload[0].payload as { os: string; count: number };
                                const percentage = totalClicks > 0 ? ((pData.count / totalClicks) * 100).toFixed(1) : '0';
                                return (
                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-xl text-xs space-y-0.5 border border-slate-700/50">
                                        <p className="font-semibold">{pData.os}</p>
                                        <p className="text-slate-300">
                                            {pData.count} clicks ({percentage}%)
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                        {sortedData.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={OS_COLORS[index % OS_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
