import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/60 flex">
            {/* Desktop Sidebar (Fixed Left) */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay (Drawer) */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 w-64 z-50 animate-in slide-in-from-left duration-200">
                        <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
