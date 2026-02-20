import React from 'react';
import clsx from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, trendValue, color = "blue" }) {
    const colorMap = {
        blue: "text-primary-600 bg-primary-100 ring-1 ring-primary-500/20",
        green: "text-status-success bg-status-success/10 ring-1 ring-status-success/20",
        red: "text-status-danger bg-status-danger/10 ring-1 ring-status-danger/20",
        amber: "text-status-warning bg-status-warning/10 ring-1 ring-status-warning/20",
        teal: "text-accent-teal bg-accent-teal/10 ring-1 ring-accent-teal/20",
    };

    const isPositive = trend === 'up';

    return (
        <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-lift transition-all duration-300">
            <div className="flex justify-between items-start z-10 relative">
                <div className="space-y-1">
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">{value}</h3>
                </div>
                <div className={clsx("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", colorMap[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                {trendValue ? (
                    <div className={clsx(
                        "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors",
                        isPositive
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                    )}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trendValue}
                    </div>
                ) : <div className="h-6"></div>}

                <div className="h-1 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={clsx("h-full rounded-full transition-all duration-1000 w-[60%]",
                            color === 'blue' && "bg-primary-500",
                            color === 'green' && "bg-status-success",
                            color === 'red' && "bg-status-danger",
                            color === 'amber' && "bg-status-warning",
                            color === 'teal' && "bg-accent-teal",
                        )}
                    />
                </div>
            </div>

            {/* Background Glow - Subtle & Elegant */}
            <div className={clsx(
                "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none",
                color === 'blue' && "bg-primary-500",
                color === 'green' && "bg-status-success",
                color === 'red' && "bg-status-danger",
                color === 'amber' && "bg-status-warning",
                color === 'teal' && "bg-accent-teal"
            )} />
        </div>
    );
}
