import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Smartphone, Monitor, Tablet as TabletIcon, Bot, HelpCircle } from 'lucide-react';
import type { ClicksByDevice } from '../types';

interface DeviceDonutChartProps {
    data: ClicksByDevice[];
}

const DEVICE_COLORS: Record<string, string> = {
    Desktop: '#4f46e5',
    Mobile: '#10b981',
    Tablet: '#f59e0b',
    'Bot/Crawler': '#64748b',
    Unknown: '#94a3b8',
};

const DEFAULT_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function DeviceDonutChart({ data }: DeviceDonutChartProps) {
    const totalClicks = data.reduce((sum, item) => sum + item.count, 0);

    if (!data || data.length === 0 || totalClicks === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                No device data available.
            </div>
        );
    }

    const getDeviceIcon = (device: string) => {
        const lower = device.toLowerCase();
        if (lower.includes('mobile') || lower.includes('phone')) return <Smartphone className="size-3.5" />;
        if (lower.includes('desktop') || lower.includes('pc') || lower.includes('mac')) return <Monitor className="size-3.5" />;
        if (lower.includes('tablet') || lower.includes('ipad')) return <TabletIcon className="size-3.5" />;
        if (lower.includes('bot')) return <Bot className="size-3.5" />;
        return <HelpCircle className="size-3.5" />;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-52 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const pData = payload[0].payload as { device: string; count: number };
                                    const percentage = totalClicks > 0 ? ((pData.count / totalClicks) * 100).toFixed(1) : '0';
                                    return (
                                        <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg shadow-xl text-xs space-y-0.5 border border-slate-700/50">
                                            <p className="font-semibold">{pData.device}</p>
                                            <p className="text-slate-300">
                                                {pData.count} clicks ({percentage}%)
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="device"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={DEVICE_COLORS[entry.device] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Total Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-900">{totalClicks}</span>
                    <span className="text-[11px] text-slate-400 font-medium">Clicks</span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                {data.map((item, idx) => {
                    const percentage = totalClicks > 0 ? ((item.count / totalClicks) * 100).toFixed(0) : '0';
                    const color = DEVICE_COLORS[item.device] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
                    return (
                        <div key={item.device} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/70">
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-slate-500 shrink-0">{getDeviceIcon(item.device)}</span>
                                <span className="font-medium text-slate-700 truncate">{item.device}</span>
                            </div>
                            <span className="font-bold text-slate-900 ml-1 shrink-0">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
