import React from 'react';
import { Bell, Search, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';

export default function Topbar({ title, isConnected, notifications = [] }) {
    return (
        <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Page Title */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* System Status */}
                <div className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
                    isConnected
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                    {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>{isConnected ? "System Online" : "Disconnected"}</span>
                </div>

                {/* Global Search */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        name="search"
                        autoComplete="off"
                        placeholder="Search logs, residents..."
                        className="bg-dark-800 border border-dark-700 text-sm text-gray-200 rounded-full pl-10 pr-4 py-1.5 w-64 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-900 animate-pulse"></span>
                    )}
                </button>
            </div>
        </header>
    );
}
