import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import clsx from 'clsx';

export default function Layout({ children, activePage, onNavigate, title, isConnected }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-dark-900 text-white overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                activePage={activePage}
                onNavigate={onNavigate}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div
                className={clsx(
                    "flex-1 flex flex-col h-full transition-all duration-300",
                    isSidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <Topbar title={title} isConnected={isConnected} />

                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-7xl mx-auto space-y-6 animate-enter">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
