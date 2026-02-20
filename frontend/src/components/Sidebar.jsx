import React from 'react';
import { LayoutDashboard, Video, FileText, Settings, ShieldAlert, LogOut, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ activePage, onNavigate, isCollapsed, toggleSidebar }) {
    const navItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: FileText },
        { id: 'live', label: 'Live Monitoring', icon: Video },
        { id: 'incidents', label: 'Incident Logs', icon: ShieldAlert },
        { id: 'settings', label: 'System Settings', icon: Settings },
    ];

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200 transition-all duration-500 z-50 flex flex-col shadow-soft",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Brand Header */}
            <div className="h-20 flex items-center px-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-accent-teal rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-105 active:scale-95 duration-300">
                    <ShieldAlert className="text-white w-6 h-6" />
                </div>

                <div className={clsx("ml-4 transition-all duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                    <h1 className="font-bold text-xl text-gray-900 tracking-tight leading-none">
                        Suraksha<span className="text-primary-600">Setu</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Enterprise Security</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={clsx(
                                "w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-primary-50 text-primary-600 shadow-sm font-semibold"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary-500 rounded-r-full shadow-glow-blue" />
                            )}

                            <Icon
                                className={clsx(
                                    "w-5 h-5 transition-colors duration-300",
                                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-500"
                                )}
                            />

                            <span className={clsx(
                                "ml-3 transition-all duration-300 whitespace-nowrap",
                                isCollapsed ? "opacity-0 w-0 translate-x-10" : "opacity-100 w-auto translate-x-0"
                            )}>
                                {item.label}
                            </span>

                            {/* Chevron for active state */}
                            {isActive && !isCollapsed && (
                                <ChevronRight className="w-4 h-4 ml-auto text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}

                            {/* Floating Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-[70px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl pointer-events-none z-50 translate-x-2 group-hover:translate-x-0">
                                    {item.label}
                                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 transform" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Toggle & Profile */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center p-2 rounded-xl text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-soft transition-all duration-300 group"
                >
                    {isCollapsed ? (
                        <div className="w-full flex justify-center">
                            <Menu className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                        </div>
                    ) : (
                        <div className="flex items-center w-full px-1">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-white flex items-center justify-center border border-gray-200 shadow-sm relative">
                                <span className="text-xs font-bold text-gray-700">AD</span>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-status-success border-2 border-white rounded-full"></span>
                            </div>
                            <div className="ml-3 text-left flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">Security Head</p>
                            </div>
                            <div className="p-1 rounded-lg hover:bg-gray-200/50 transition-colors">
                                <LogOut className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
