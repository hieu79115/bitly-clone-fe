import { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!data || data.length === 0 || totalClicks === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
                No device data available.
            </div>
        );
    }

    const activeItem = activeIndex !== null ? data[activeIndex] : null;
    const activeColor = activeItem
        ? (DEVICE_COLORS[activeItem.device] || DEFAULT_COLORS[activeIndex! % DEFAULT_COLORS.length])
        : null;

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
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="device"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {data.map((entry, index) => {
                                const isHovered = activeIndex === index;
                                const isDimmed = activeIndex !== null && !isHovered;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={DEVICE_COLORS[entry.device] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                        stroke="transparent"
                                        opacity={isDimmed ? 0.35 : 1}
                                        className="transition-all duration-200 cursor-pointer"
                                    />
                                );
                            })}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Dynamic Center Text: Shows Total by default, switches to Hovered Device details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    {activeItem ? (
                        <div className="text-center px-2 animate-in fade-in zoom-in-95 duration-150">
                            <span
                                className="text-xs font-bold block truncate max-w-[90px]"
                                style={{ color: activeColor || '#1e293b' }}
                            >
                                {activeItem.device}
                            </span>
                            <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                                {activeItem.count}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold block">
                                {totalClicks > 0 ? ((activeItem.count / totalClicks) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    ) : (
                        <div className="text-center animate-in fade-in duration-150">
                            <span className="text-2xl font-bold text-slate-900 block leading-tight">
                                {totalClicks}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium block">
                                Clicks
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Interactive Legend */}
            <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                {data.map((item, idx) => {
                    const percentage = totalClicks > 0 ? ((item.count / totalClicks) * 100).toFixed(0) : '0';
                    const color = DEVICE_COLORS[item.device] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
                    const isHovered = activeIndex === idx;

                    return (
                        <div
                            key={item.device}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all cursor-pointer ${
                                isHovered
                                    ? 'bg-slate-100 ring-1 ring-slate-200 shadow-xs'
                                    : 'bg-slate-50/70 hover:bg-slate-100/70'
                            }`}
                        >
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
