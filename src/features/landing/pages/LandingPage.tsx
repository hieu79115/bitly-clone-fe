import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Link2,
    Sparkles,
    BarChart3,
    QrCode,
    Zap,
    Clock,
    Tag as TagIcon,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    Copy,
    Check,
    Layers,
    Monitor,
    Globe,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Interactive Demo state in Hero section
    const [demoInput, setDemoInput] = useState('');
    const [demoShortened, setDemoShortened] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // FAQ open state
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleDemoShorten = (e: React.FormEvent) => {
        e.preventDefault();
        if (!demoInput.trim()) return;
        const randomCode = Math.random().toString(36).substring(2, 8);
        setDemoShortened(`http://localhost:8080/${randomCode}`);
    };

    const handleCopyDemo = () => {
        if (!demoShortened) return;
        navigator.clipboard.writeText(demoShortened);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const faqs = [
        {
            q: 'Is Shortener free to use?',
            a: 'Yes! You can register a free account and start shortening, customizing, and organizing your links with full analytics right away.',
        },
        {
            q: 'How fast does the link redirection work?',
            a: 'Our backend utilizes high-throughput Spring Boot combined with Redis in-memory caching, delivering sub-millisecond redirection latency for your visitors worldwide.',
        },
        {
            q: 'Can I track click analytics for individual links?',
            a: 'Yes, every link comes with a detailed analytics dashboard showing total clicks, daily engagement over time, top browsers, operating systems, and device types.',
        },
        {
            q: 'Can I customize the link alias and set expiration dates?',
            a: 'Absolutely! You can choose custom memorable back-halves (slugs) like /my-promo and set specific expiration timestamps for time-sensitive marketing campaigns.',
        },
        {
            q: 'Can I generate QR codes for my links?',
            a: 'Yes! Every shortened link has an instant dynamic QR code that you can preview and download as high-resolution PNG for print and social media.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 selection:text-primary">
            {/* Sticky Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 font-extrabold text-slate-900 text-lg tracking-tight">
                        <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25">
                            <Link2 className="size-5" />
                        </div>
                        <span>Shortener</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#analytics" className="hover:text-primary transition-colors">Analytics</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
                        <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                    </nav>

                    {/* Auth Action Buttons */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button
                                size="sm"
                                onClick={() => navigate('/dashboard')}
                                className="gap-1.5 shadow-sm"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                    className="text-xs font-semibold gap-1.5 shadow-xs"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="size-3.5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
                {/* Background decorative gradient orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-tr from-primary/15 to-sky-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
                        <Sparkles className="size-3.5" />
                        <span>Next-Gen URL Shortener & Traffic Analytics</span>
                    </div>

                    {/* Hero Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                        Smarter Links. <br />
                        <span className="bg-gradient-to-r from-primary via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                            Deeper Audience Insights.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
                        Transform long, cluttered links into concise, branded URLs with sub-millisecond redirection.
                        Track real-time clicks, device breakdowns, browser analytics, and dynamic QR codes in one place.
                    </p>

                    {/* Call to Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        {isAuthenticated ? (
                            <Button
                                size="lg"
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto h-11 px-7 gap-2 shadow-md shadow-primary/25 text-sm font-semibold rounded-xl"
                            >
                                <span>Open Your Dashboard</span>
                                <ArrowRight className="size-4" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/register')}
                                    className="w-full sm:w-auto h-11 px-7 gap-2 shadow-md shadow-primary/25 text-sm font-semibold rounded-xl"
                                >
                                    <span>Create Free Account</span>
                                    <ArrowRight className="size-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto h-11 px-6 text-sm font-semibold rounded-xl bg-white hover:bg-slate-50"
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Live Interactive Shorten Demo Card */}
                    <div className="pt-8 max-w-2xl mx-auto">
                        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3 text-left">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                                <span className="flex items-center gap-1.5">
                                    <Zap className="size-3.5 text-amber-500" />
                                    <span>Try a live demo instantly:</span>
                                </span>
                                <span className="text-[11px] text-slate-400">No login required</span>
                            </div>

                            <form onSubmit={handleDemoShorten} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="url"
                                    required
                                    value={demoInput}
                                    onChange={(e) => setDemoInput(e.target.value)}
                                    placeholder="Paste your long link here (e.g. https://github.com/facebook/react)..."
                                    className="flex-1 h-10 px-3.5 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                                />
                                <Button type="submit" className="h-10 px-5 text-xs font-semibold rounded-xl shrink-0 gap-1.5">
                                    <Sparkles className="size-3.5" />
                                    <span>Shorten</span>
                                </Button>
                            </form>

                            {/* Demo result */}
                            {demoShortened && (
                                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 animate-in fade-in zoom-in-98 duration-150">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-emerald-800">
                                            Your short link demo:
                                        </p>
                                        <span className="text-xs font-bold text-primary font-mono truncate block">
                                            {demoShortened}
                                        </span>
                                    </div>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={handleCopyDemo}
                                        className="gap-1 bg-white text-xs shrink-0"
                                    >
                                        {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section id="features" className="py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                            Key Features
                        </h2>
                        <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Everything you need to master your short links
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Engineered for high performance, modern user experience, and scalable analytics.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1: Lightning Fast */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <Zap className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Sub-Millisecond Redirects</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Powered by Spring Boot and Redis in-memory storage, your visitors reach their destination almost instantaneously.
                            </p>
                        </div>

                        {/* Feature 2: In-Depth Analytics */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <BarChart3 className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Comprehensive Analytics</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Monitor click volumes over 7, 30, and 90 days. Gain insights into top browsers, operating systems, and device splits.
                            </p>
                        </div>

                        {/* Feature 3: Custom Slugs */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <Sparkles className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Custom Slugs & Aliases</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Customize back-halves to make links clean, recognizable, and on-brand, like <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">/launch-day</code>.
                            </p>
                        </div>

                        {/* Feature 4: Dynamic QR Codes */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <QrCode className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Dynamic QR Codes</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Automatically generate crisp QR codes for any link. Download them in one click for packaging, slides, or print campaigns.
                            </p>
                        </div>

                        {/* Feature 5: Expiration Controls */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <Clock className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Auto-Expiry & Scheduling</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Run time-bound promotions with automated expiration. Once expired, links safely redirect to an informative expiration page.
                            </p>
                        </div>

                        {/* Feature 6: Tags & Search Management */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3 group">
                            <div className="size-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                                <TagIcon className="size-5" />
                            </div>
                            <h3 className="font-bold text-base text-slate-900">Tags & Server Search</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Organize links into custom tags. Find any link instantly across your entire account with server-side debounce search.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Showcase Preview Section */}
            <section id="analytics" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl space-y-4">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                Analytics at a Glance
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                                Know who clicks, where they come from, and what devices they use.
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Never wonder how your links perform again. Every click records key visitor telemetry without collecting invasive personal identifiers.
                            </p>

                            <div className="space-y-2.5 pt-2">
                                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span>Interactive 7, 30, and 90-day engagement charts</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span>Breakdown by Mobile, Desktop, and Tablet</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span>Top Web Browsers (Chrome, Edge, Safari, Firefox)</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                                    <span>Operating Systems (Windows, macOS, iOS, Android)</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive UI Card Mockup */}
                        <div className="w-full lg:w-[460px] bg-slate-50 p-5 rounded-2xl border border-slate-200/80 shadow-lg space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                    <BarChart3 className="size-4 text-primary" />
                                    <span>Traffic Breakdown Preview</span>
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    Live Sample
                                </span>
                            </div>

                            {/* Mini KPIs */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Total</p>
                                    <p className="text-base font-extrabold text-slate-900 mt-0.5">14,250</p>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Top Device</p>
                                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">Desktop</p>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Top OS</p>
                                    <p className="text-base font-extrabold text-indigo-600 mt-0.5">Windows</p>
                                </div>
                            </div>

                            {/* Simulated Bars */}
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-2">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                                        <span className="flex items-center gap-1.5"><Globe className="size-3 text-sky-500" /> Chrome</span>
                                        <span className="font-semibold">68%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '68%' }} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                                        <span className="flex items-center gap-1.5"><Monitor className="size-3 text-indigo-500" /> Edge</span>
                                        <span className="font-semibold">22%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '22%' }} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600">
                                        <span className="flex items-center gap-1.5"><Layers className="size-3 text-amber-500" /> Safari</span>
                                        <span className="font-semibold">10%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 sm:py-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                            Simplicity First
                        </h2>
                        <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Create & share links in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                        {/* Step 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
                            <span className="size-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mx-auto">
                                1
                            </span>
                            <h3 className="font-bold text-base text-slate-900">Paste Long URL</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Enter any web address from your campaigns, blog posts, portfolios, or affiliate programs.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
                            <span className="size-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mx-auto">
                                2
                            </span>
                            <h3 className="font-bold text-base text-slate-900">Customize & Set Rules</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Optionally add a custom slug, expiration date, or organize it into tags for easy searching.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative">
                            <span className="size-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mx-auto">
                                3
                            </span>
                            <h3 className="font-bold text-base text-slate-900">Share & Track Clicks</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Copy your short link or download its QR code. Watch incoming traffic update automatically on your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion Section */}
            <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="text-center space-y-3">
                        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                            Questions & Answers
                        </h2>
                        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            Frequently Asked Questions
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-semibold text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`size-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-500 leading-relaxed animate-in fade-in duration-150 border-t border-slate-100 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Call To Action Banner */}
            <section className="py-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        Ready to take your links to the next level?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                        Start shortening and tracking your URLs today. Fast, privacy-friendly, and completely free.
                    </p>
                    <div className="pt-2">
                        {isAuthenticated ? (
                            <Button
                                size="lg"
                                onClick={() => navigate('/dashboard')}
                                className="h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm shadow-xl shadow-primary/30"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight className="size-4 ml-1.5" />
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                onClick={() => navigate('/register')}
                                className="h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm shadow-xl shadow-primary/30"
                            >
                                <span>Create Free Account Now</span>
                                <ArrowRight className="size-4 ml-1.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <div className="size-7 rounded-lg bg-primary text-white flex items-center justify-center">
                            <Link2 className="size-4" />
                        </div>
                        <span>Shortener</span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                        &copy; {new Date().getFullYear()} Shortener Inc. Built with Spring Boot 3 & React. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-[11px]">
                        <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
                        <Link to="/register" className="hover:text-white transition-colors">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
