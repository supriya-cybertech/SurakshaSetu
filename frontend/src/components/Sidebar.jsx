import React from 'react';
import { LayoutDashboard, Video, FileText, Settings, ShieldAlert, LogOut, Menu } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ activePage, onNavigate, isCollapsed, toggleSidebar }) {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'live', label: 'Live Monitoring', icon: Video },
        { id: 'incidents', label: 'Incident Logs', icon: ShieldAlert },
        { id: 'settings', label: 'System Settings', icon: Settings },
    ];

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-full bg-dark-900/95 backdrop-blur-xl border-r border-white/5 transition-all duration-300 z-50 flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-blue-400 rounded-lg flex items-center justify-center shrink-0 shadow-neon-blue">
                    <ShieldAlert className="text-white w-5 h-5" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-bold text-lg text-white tracking-wide animate-fade-in">
                        Suraksha<span className="text-primary-500">Setu</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={clsx(
                                "w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary-600/10 text-primary-500 shadow-neon-blue/20"
                                    : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full" />
                            )}

                            <Icon
                                className={clsx(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-primary-500" : "text-gray-400 group-hover:text-gray-100"
                                )}
                            />

                            {!isCollapsed && (
                                <span className="ml-3 font-medium animate-fade-in text-sm">
                                    {item.label}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-dark-800 text-xs text-white rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : (
                        <div className="flex items-center w-full px-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                                <span className="text-xs font-bold text-white">AD</span>
                            </div>
                            <div className="ml-3 text-left">
                                <p className="text-xs font-medium text-white">Admin User</p>
                                <p className="text-[10px] text-gray-500">Security Head</p>
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
