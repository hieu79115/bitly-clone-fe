import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { ClicksByBrowser } from '../types';

interface BrowserBarChartProps {
    data: ClicksByBrowser[];
}

const BROWSER_COLORS = [
    '#3b82f6', // Chrome / Blue
    '#0ea5e9', // Safari / Sky
    '#f97316', // Firefox / Orange
    '#10b981', // Edge / Emerald
    '#ef4444', // Opera / Red
    '#8b5cf6', // Purple
];

export default function BrowserBarChart({ data }: BrowserBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                No browser data available.
            </div>
        );
    }

    // Sort descending by count and take top 6
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
                        dataKey="browser"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        width={80}
                    />
                    <Tooltip
                        cursor={false}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const pData = payload[0].payload as { browser: string; count: number };
                                const percentage = totalClicks > 0 ? ((pData.count / totalClicks) * 100).toFixed(1) : '0';
                                return (
                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-xl text-xs space-y-0.5 border border-slate-700/50">
                                        <p className="font-semibold">{pData.browser}</p>
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
                                fill={BROWSER_COLORS[index % BROWSER_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
