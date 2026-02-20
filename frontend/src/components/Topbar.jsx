import React from 'react';
import { Bell, Search, Wifi, WifiOff, Calendar, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export default function Topbar({ title, isConnected, notifications = [] }) {
    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 mb-4">
            {/* Page Title & Breadcrumbs */}
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span>SurakshaSetu</span>
                    <span>/</span>
                    <span className="text-primary-600">{title}</span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Date Widget */}
                <div className="hidden lg:flex items-center gap-2 text-gray-500 text-sm font-medium bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>

                {/* System Status */}
                <div className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm transition-all",
                    isConnected
                        ? "bg-status-success/10 border-status-success/20 text-status-success shadow-glow-lime/20"
                        : "bg-status-danger/10 border-status-danger/20 text-status-danger shadow-glow-red/20"
                )}>
                    {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>{isConnected ? "System Online" : "Disconnected"}</span>
                </div>

                {/* divider */}
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                {/* Global Search */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        name="search"
                        autoComplete="off"
                        placeholder="Search logs, residents..."
                        className="bg-white border border-gray-200 text-sm text-gray-700 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm group-hover:shadow-md"
                    />
                </div>

                {/* Helper Action */}
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </button>
            </div>
        </header>
    );
}
