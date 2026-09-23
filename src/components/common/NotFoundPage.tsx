import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
            <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6 shadow-xs border border-slate-200">
                <FileQuestion className="size-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
            <h2 className="text-xl font-semibold text-slate-800 mt-2">Page not found</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="mt-6">
                <Link to="/dashboard">
                    <Button className="gap-2">
                        <ArrowLeft className="size-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
