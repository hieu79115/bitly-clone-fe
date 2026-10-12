import { Link, useSearchParams } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LinkDisabledPage() {
    const [searchParams] = useSearchParams();
    const shortCode = searchParams.get('code');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
            <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 shadow-xs border border-amber-200">
                <ShieldAlert className="size-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Link Disabled</h1>
            <p className="text-sm text-slate-600 mt-2 max-w-md">
                This short link <span className="font-mono font-semibold text-slate-800">{shortCode ? `(${shortCode})` : ''}</span> has been disabled by platform administrators due to safety guidelines or policy restrictions.
            </p>

            <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-left max-w-md text-xs text-amber-800 flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                    To protect users from malicious content or phishing, short links flagged for safety violations are deactivated and barred from further traffic.
                </span>
            </div>

            <div className="mt-8 flex gap-3">
                <Link to="/">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="size-4" />
                        <span>Go to Homepage</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
