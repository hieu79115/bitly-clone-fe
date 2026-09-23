import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
            <div className="size-16 rounded-2xl flex items-center justify-center text-red-500 mb-6 shadow-xs border border-slate-200">
                <ShieldAlert className="size-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">403</h1>
            <h2 className="text-xl font-semibold text-slate-800 mt-2">Access Denied</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
                You do not have the required permissions to view this resource.
            </p>
            <div className="mt-6">
                <Link to="/dashboard">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="size-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
