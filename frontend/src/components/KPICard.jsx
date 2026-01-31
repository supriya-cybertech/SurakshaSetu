import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, trendValue, color = "blue" }) {
    const colorMap = {
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-green-500 bg-green-500/10",
        red: "text-red-500 bg-red-500/10",
        amber: "text-amber-500 bg-amber-500/10",
    };

    const isPositive = trend === 'up';

    return (
        <div className="glass-card p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
                </div>
                <div className={clsx("p-2 rounded-lg", colorMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {trendValue && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={clsx(
                        "text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                        isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    )}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trendValue}
                    </span>
                    <span className="text-xs text-gray-500">vs last week</span>
                </div>
            )}

            {/* Background Glow */}
            <div className={clsx(
                "absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none",
                color === 'blue' && "bg-blue-500",
                color === 'green' && "bg-green-500",
                color === 'red' && "bg-red-500",
                color === 'amber' && "bg-amber-500",
            )} />
        </div>
    );
}
