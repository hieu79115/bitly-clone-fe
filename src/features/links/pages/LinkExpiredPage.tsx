import { Link, useSearchParams } from 'react-router-dom';
import { ClockAlert, ArrowRight, Link2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LinkExpiredPage() {
    const [searchParams] = useSearchParams();
    const shortCode = searchParams.get('code');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
            {/* Expired Icon */}
            <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 shadow-xs border border-amber-100">
                <ClockAlert className="size-8" />
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Link Expired</h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
                The link {shortCode ? <code className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md text-xs">/{shortCode}</code> : 'you are trying to visit'} has reached its expiration date and is no longer active.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                    <Button className="gap-2 w-full sm:w-auto shadow-sm">
                        <Link2 className="size-4" />
                        <span>Create your own short links</span>
                        <ArrowRight className="size-4" />
                    </Button>
                </Link>
                <Link to="/">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <Home className="size-4" />
                        <span>Go to Home</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
