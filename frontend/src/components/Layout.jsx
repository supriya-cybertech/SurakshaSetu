import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import clsx from 'clsx';

export default function Layout({ children, activePage, onNavigate, title, isConnected }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background-primary text-text-primary overflow-hidden relative selection:bg-accent-teal/20 selection:text-accent-teal">
            {/* Background Accents (Orbs) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/10 rounded-full blur-[120px] animate-pulse-subtle"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent-teal/10 rounded-full blur-[100px] animate-pulse-subtle delay-1000"></div>
            </div>

            {/* Sidebar */}
            <div className="z-20 h-full">
                <Sidebar
                    activePage={activePage}
                    onNavigate={onNavigate}
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full z-10 relative overflow-hidden">
                <Topbar title={title} isConnected={isConnected} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
                    <div className="max-w-[1600px] mx-auto space-y-8 animate-enter pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
