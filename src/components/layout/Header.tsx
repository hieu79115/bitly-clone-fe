import { Menu, Plus } from 'lucide-react';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
    onOpenMobileSidebar: () => void;
}

export default function Header({ onOpenMobileSidebar }: HeaderProps) {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left: Mobile Toggle Button */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMobileSidebar}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                    <Menu className="size-5" />
                </button>
            </div>

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3">
                <Button size="sm" className="hidden sm:inline-flex gap-1.5 shadow-sm">
                    <Plus className="size-4" />
                    <span>Create link</span>
                </Button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                <UserMenu />
            </div>
        </header>
    );
}
