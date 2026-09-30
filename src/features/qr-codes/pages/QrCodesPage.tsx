import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    QrCode,
    Download,
    Copy,
    Check,
    Palette,
    Link2,
    Smile,
    Upload,
    RotateCcw,
    Square,
} from 'lucide-react';
import QRCodeStyling, { type DotType, type CornerSquareType } from 'qr-code-styling';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { exportStyledQrCode, type FrameStyle } from '../utils/qrExport';

const FRAME_STYLES: { label: string; value: FrameStyle }[] = [
    { label: 'Clean Margin', value: 'minimal' },
    { label: 'Card Frame', value: 'card' },
    { label: 'Square Border', value: 'outline' },
    { label: 'No Border', value: 'none' },
];

const COLOR_PRESETS = [
    { label: 'Slate Dark', value: '#0f172a' },
    { label: 'Indigo Brand', value: '#4f46e5' },
    { label: 'Ocean Blue', value: '#0284c7' },
    { label: 'Emerald Green', value: '#059669' },
    { label: 'Rose Pink', value: '#e11d48' },
    { label: 'Amber Orange', value: '#d97706' },
    { label: 'Purple Violet', value: '#7c3aed' },
];

const DOT_TYPES: { label: string; value: DotType }[] = [
    { label: 'Rounded', value: 'rounded' },
    { label: 'Dots', value: 'dots' },
    { label: 'Classy', value: 'classy' },
    { label: 'Square', value: 'square' },
];

const CORNER_TYPES: { label: string; value: CornerSquareType }[] = [
    { label: 'Extra Rounded', value: 'extra-rounded' },
    { label: 'Dot', value: 'dot' },
    { label: 'Square', value: 'square' },
];

const MASCOT_PRESETS = [
    {
        id: 'none',
        name: 'None',
        icon: '🚫',
        url: null,
    },
    {
        id: 'link',
        name: 'Link',
        icon: '🔗',
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="%230f172a"/><path d="M38 58 C32 52 32 42 38 36 L46 28 C52 22 62 22 68 28 C74 34 74 44 68 50 L64 54 M62 42 C68 48 68 58 62 64 L54 72 C48 78 38 78 32 72 C26 66 26 56 32 50 L36 46" fill="none" stroke="%23ffffff" stroke-width="7" stroke-linecap="round"/></svg>',
    },
    {
        id: 'rocket',
        name: 'Rocket',
        icon: '🚀',
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="%234f46e5"/><path d="M50 20 C62 30 68 46 66 62 L34 62 C32 46 38 30 50 20 Z" fill="%23ffffff"/><circle cx="50" cy="42" r="7" fill="%234f46e5"/><path d="M34 62 L24 74 L38 70 Z" fill="%23f43f5e"/><path d="M66 62 L76 74 L62 70 Z" fill="%23f43f5e"/><polygon points="44,62 56,62 50,78" fill="%23fbbf24"/></svg>',
    },
    {
        id: 'lightning',
        name: 'Flash',
        icon: '⚡',
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="%23f59e0b"/><polygon points="56,15 28,52 50,52 44,85 72,44 50,44" fill="%23ffffff"/></svg>',
    },
    {
        id: 'monster',
        name: 'Monster',
        icon: '👾',
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill="%232563eb"/><circle cx="36" cy="42" r="11" fill="%23ffffff"/><circle cx="64" cy="42" r="11" fill="%23ffffff"/><circle cx="37" cy="43" r="5" fill="%230f172a"/><circle cx="65" cy="43" r="5" fill="%230f172a"/><path d="M 30 65 Q 50 82 70 65 Z" fill="%230f172a"/><polygon points="38,65 44,73 50,65" fill="%23ffffff"/><polygon points="50,65 56,73 62,65" fill="%23ffffff"/><path d="M 22 22 Q 28 10 36 20" fill="none" stroke="%2360a5fa" stroke-width="5" stroke-linecap="round"/><path d="M 78 22 Q 72 10 64 20" fill="none" stroke="%2360a5fa" stroke-width="5" stroke-linecap="round"/></svg>',
    },
];

export default function QrCodesPage() {
    const [searchParams] = useSearchParams();
    const initialUrl = searchParams.get('url') || 'https://google.com';

    // Target URL input
    const [targetUrl, setTargetUrl] = useState<string>(initialUrl);

    // Style Customization State
    const [qrColor, setQrColor] = useState<string>('#0f172a');
    const [dotType, setDotType] = useState<DotType>('rounded');
    const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
    const [frameStyle, setFrameStyle] = useState<FrameStyle>('minimal');
    const [selectedMascotId, setSelectedMascotId] = useState<string>('none');
    const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // DOM & Canvas
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Copy State
    const [hasCopied, setHasCopied] = useState(false);

    // Selected mascot or uploaded custom logo
    const effectiveLogo = customLogoUrl || (MASCOT_PRESETS.find((m) => m.id === selectedMascotId)?.url ?? undefined);

    // Initialize or Update QR code instance
    useEffect(() => {
        if (!containerRef.current) return;

        const dataToEncode = targetUrl.trim() || 'https://shortener.com';

        if (!qrCodeInstanceRef.current) {
            qrCodeInstanceRef.current = new QRCodeStyling({
                width: 280,
                height: 280,
                data: dataToEncode,
                dotsOptions: {
                    color: qrColor,
                    type: dotType,
                },
                cornersSquareOptions: {
                    type: cornerType,
                    color: qrColor,
                },
                cornersDotOptions: {
                    type: 'dot',
                    color: qrColor,
                },
                image: effectiveLogo,
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 5,
                    imageSize: 0.32,
                    hideBackgroundDots: true,
                },
                backgroundOptions: {
                    color: '#ffffff',
                },
            });
            containerRef.current.innerHTML = '';
            qrCodeInstanceRef.current.append(containerRef.current);
        } else {
            qrCodeInstanceRef.current.update({
                data: dataToEncode,
                dotsOptions: {
                    color: qrColor,
                    type: dotType,
                },
                cornersSquareOptions: {
                    type: cornerType,
                    color: qrColor,
                },
                cornersDotOptions: {
                    type: 'dot',
                    color: qrColor,
                },
                image: effectiveLogo,
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 5,
                    imageSize: 0.32,
                    hideBackgroundDots: true,
                },
            });

            if (containerRef.current.children.length === 0) {
                containerRef.current.innerHTML = '';
                qrCodeInstanceRef.current.append(containerRef.current);
            }
        }
    }, [targetUrl, qrColor, dotType, cornerType, effectiveLogo]);

    // Handle Custom Logo Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Logo image must be under 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setCustomLogoUrl(dataUrl);
            setSelectedMascotId('custom');
            toast.success('Custom logo loaded!');
        };
        reader.readAsDataURL(file);
    };

    // Download handlers
    const handleDownload = async (extension: 'png' | 'svg') => {
        try {
            setIsDownloading(true);
            await exportStyledQrCode({
                data: targetUrl.trim() || 'https://google.com',
                dotsType: dotType,
                cornersSquareType: cornerType,
                qrColor,
                logoUrl: effectiveLogo,
                frameStyle,
                fileName: `qrcode-${Date.now()}`,
                extension,
            });
            const frameDesc = frameStyle === 'card' ? 'card border' : frameStyle === 'outline' ? 'square border' : frameStyle;
            toast.success(`Downloaded QR Code with ${frameDesc} (${extension.toUpperCase()})`);
        } catch (err) {
            console.error('QR download error:', err);
            toast.error('Failed to download QR code');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyUrl = () => {
        if (!targetUrl.trim()) return;
        navigator.clipboard.writeText(targetUrl.trim());
        setHasCopied(true);
        toast.success('URL copied to clipboard');
        setTimeout(() => setHasCopied(false), 2000);
    };

    const handleReset = () => {
        setQrColor('#0f172a');
        setDotType('rounded');
        setCornerType('extra-rounded');
        setFrameStyle('minimal');
        setSelectedMascotId('none');
        setCustomLogoUrl(null);
        toast.info('Reset styles to default');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        QR Studio
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create and customize high-resolution vector QR codes for any URL or text.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="self-start sm:self-auto gap-1.5 rounded-xl text-xs text-slate-600 cursor-pointer"
                >
                    <RotateCcw className="size-3.5" />
                    <span>Reset Styles</span>
                </Button>
            </div>

            {/* Target URL Input Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="size-3.5 text-primary" />
                    <span>Destination URL or Content</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        type="text"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="Enter any URL or text (e.g. https://example.com/promo)"
                        className="h-11 rounded-xl text-sm"
                    />
                    <Button
                        variant="outline"
                        onClick={handleCopyUrl}
                        className="h-11 gap-1.5 shrink-0 rounded-xl cursor-pointer"
                        title="Copy Target Link"
                    >
                        {hasCopied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                        <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                    </Button>
                </div>
            </div>

            {/* Studio 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* LEFT COLUMN: Style Customization Controls */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-5 flex-1 flex flex-col justify-between">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Palette className="size-4 text-primary" />
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                Customization
                            </h2>
                        </div>

                        {/* Dot Pattern Shape */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Pattern Style
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {DOT_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setDotType(type.value)}
                                        className={cn(
                                            "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center",
                                            dotType === type.value
                                                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Corner Eye Shape */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Corner Eye Shape
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {CORNER_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setCornerType(type.value)}
                                        className={cn(
                                            "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center",
                                            cornerType === type.value
                                                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        )}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Frame & Border Style */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Square className="size-3.5 text-primary" />
                                <span>Frame & Border</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {FRAME_STYLES.map((frame) => (
                                    <button
                                        key={frame.value}
                                        type="button"
                                        onClick={() => setFrameStyle(frame.value)}
                                        className={cn(
                                            "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center",
                                            frameStyle === frame.value
                                                ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/20"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        )}
                                    >
                                        {frame.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Presets & Custom Color Picker */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Brand Color
                            </label>
                            <div className="flex flex-wrap gap-2.5 items-center">
                                {COLOR_PRESETS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setQrColor(color.value)}
                                        className={cn(
                                            "size-8 rounded-full border-2 transition-all cursor-pointer relative",
                                            qrColor.toLowerCase() === color.value.toLowerCase()
                                                ? "border-primary scale-110 shadow-sm"
                                                : "border-white hover:scale-105"
                                        )}
                                        style={{ backgroundColor: color.value }}
                                        title={color.label}
                                    >
                                        {qrColor.toLowerCase() === color.value.toLowerCase() && (
                                            <Check className="size-4 text-white absolute inset-0 m-auto drop-shadow-xs" />
                                        )}
                                    </button>
                                ))}

                                {/* Native Color Picker */}
                                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200">
                                    <input
                                        type="color"
                                        value={qrColor}
                                        onChange={(e) => setQrColor(e.target.value)}
                                        className="size-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                                        title="Choose custom color"
                                    />
                                    <span className="text-xs font-mono text-slate-500 uppercase">{qrColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Icon / Logo Selection */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Smile className="size-3.5 text-primary" />
                                    <span>Center Logo / Icon</span>
                                </label>
                                {customLogoUrl && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCustomLogoUrl(null);
                                            setSelectedMascotId('none');
                                        }}
                                        className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                                    >
                                        Remove custom logo
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {MASCOT_PRESETS.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            setCustomLogoUrl(null);
                                            setSelectedMascotId(m.id);
                                        }}
                                        className={cn(
                                            "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1",
                                            selectedMascotId === m.id && !customLogoUrl
                                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                        )}
                                    >
                                        <span className="text-lg">{m.icon}</span>
                                        <span className="text-[10px] leading-tight truncate">{m.name}</span>
                                    </button>
                                ))}

                                {/* Custom Upload Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1",
                                        customLogoUrl
                                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-2 ring-primary/20"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <Upload className="size-4 text-slate-500" />
                                    <span className="text-[10px] leading-tight">Upload Logo</span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/svg+xml"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Canvas Showcase & Action Buttons */}
                <div className="lg:col-span-5 flex flex-col min-w-0 w-full">
                    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 text-center flex-1 flex flex-col justify-between space-y-4 sm:space-y-5 min-w-0 w-full overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <QrCode className="size-4 text-primary" />
                                <span>Live Canvas Preview</span>
                            </span>
                        </div>

                        {/* Interactive Canvas Box */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-3 sm:p-6 flex-1 flex flex-col items-center justify-center my-auto min-h-[260px] sm:min-h-[320px] w-full overflow-hidden">
                            <div
                                className={cn(
                                    "transition-all duration-200 inline-block max-w-full",
                                    frameStyle === 'card' && "p-2.5 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-md border-2 border-slate-200/90",
                                    frameStyle === 'outline' && "p-2.5 sm:p-4 bg-white rounded-md shadow-sm border-2 border-slate-300",
                                    frameStyle === 'minimal' && "p-2.5 sm:p-4 bg-white rounded-xl shadow-xs border border-transparent",
                                    frameStyle === 'none' && "p-0 bg-white rounded-none shadow-none border-0"
                                )}
                            >
                                <div
                                    ref={containerRef}
                                    className="[&>canvas]:w-full [&>canvas]:max-w-[200px] sm:[&>canvas]:max-w-[260px] md:[&>canvas]:max-w-[280px] [&>canvas]:h-auto [&>canvas]:aspect-square [&>svg]:w-full [&>svg]:max-w-[200px] sm:[&>svg]:max-w-[260px] md:[&>svg]:max-w-[280px] [&>svg]:h-auto flex items-center justify-center mx-auto"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-3 sm:mt-4 font-medium flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Export will preserve {frameStyle === 'minimal' ? 'clean margin' : frameStyle === 'card' ? 'card border' : frameStyle === 'outline' ? 'square border' : 'raw style'}</span>
                            </p>
                        </div>

                        {/* Download Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                            <Button
                                onClick={() => handleDownload('png')}
                                disabled={isDownloading}
                                className="flex-1 h-11 gap-2 rounded-xl text-sm font-bold cursor-pointer"
                            >
                                <Download className="size-4" />
                                <span>{isDownloading ? 'Exporting...' : 'Download PNG (HD)'}</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleDownload('svg')}
                                disabled={isDownloading}
                                className="flex-1 h-11 gap-2 rounded-xl text-sm font-bold cursor-pointer"
                            >
                                <Download className="size-4" />
                                <span>{isDownloading ? 'Exporting...' : 'Download Vector (SVG)'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
