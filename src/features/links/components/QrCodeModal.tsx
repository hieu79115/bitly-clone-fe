import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    X,
    Download,
    ExternalLink,
    Copy,
    Check,
} from 'lucide-react';
import QRCodeStyling, { type DotType } from 'qr-code-styling';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/lib/utils';
import { exportStyledQrCode } from '@/features/qr-codes/utils/qrExport';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    shortUrl: string;
    shortCode: string;
}

const COLOR_PRESETS = [
    { label: 'Slate Dark', value: '#0f172a' },
    { label: 'Indigo Brand', value: '#4f46e5' },
    { label: 'Ocean Blue', value: '#0284c7' },
    { label: 'Emerald Green', value: '#059669' },
    { label: 'Rose Pink', value: '#e11d48' },
    { label: 'Amber Orange', value: '#d97706' },
];

const DOT_TYPES: { label: string; value: DotType }[] = [
    { label: 'Rounded', value: 'rounded' },
    { label: 'Dots', value: 'dots' },
    { label: 'Classy', value: 'classy' },
    { label: 'Square', value: 'square' },
];

export default function QrCodeModal({ isOpen, onClose, shortUrl, shortCode }: QrCodeModalProps) {
    useLockBodyScroll(isOpen);

    const [qrColor, setQrColor] = useState('#0f172a');
    const [dotType, setDotType] = useState<DotType>('rounded');
    const [hasCopied, setHasCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

    // Initialize or update qr-code-styling instance
    useEffect(() => {
        if (!isOpen) return;

        if (!qrCodeInstanceRef.current) {
            qrCodeInstanceRef.current = new QRCodeStyling({
                width: 240,
                height: 240,
                data: shortUrl,
                dotsOptions: {
                    color: qrColor,
                    type: dotType,
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: qrColor,
                },
                cornersDotOptions: {
                    type: 'dot',
                    color: qrColor,
                },
                backgroundOptions: {
                    color: '#ffffff',
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 4,
                },
            });
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                qrCodeInstanceRef.current.append(containerRef.current);
            }
        } else {
            qrCodeInstanceRef.current.update({
                data: shortUrl,
                dotsOptions: {
                    color: qrColor,
                    type: dotType,
                },
                cornersSquareOptions: {
                    color: qrColor,
                },
                cornersDotOptions: {
                    color: qrColor,
                },
            });
            if (containerRef.current && containerRef.current.children.length === 0) {
                containerRef.current.innerHTML = '';
                qrCodeInstanceRef.current.append(containerRef.current);
            }
        }
    }, [isOpen, shortUrl, qrColor, dotType]);

    if (!isOpen) return null;

    const handleDownload = async (extension: 'png' | 'svg') => {
        try {
            setIsDownloading(true);
            await exportStyledQrCode({
                data: shortUrl,
                dotsType: dotType,
                qrColor,
                frameStyle: 'minimal',
                fileName: `qrcode-${shortCode}`,
                extension,
            });
            toast.success(`Downloaded QR Code (${extension.toUpperCase()})`);
        } catch (err) {
            console.error('QR export error:', err);
            toast.error('Failed to download QR code');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setHasCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors z-10 cursor-pointer"
                    title="Close"
                >
                    <X className="size-5" />
                </button>

                {/* Modal Header */}
                <div className="mb-5 pr-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            QR Code
                        </h3>
                        <Link
                            to={`/qr-codes?url=${encodeURIComponent(shortUrl)}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full transition-colors"
                            title="Open full studio in QR Codes page"
                        >
                            <span>QR Studio</span>
                            <ExternalLink className="size-3" />
                        </Link>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-[280px] mt-0.5">{shortUrl}</p>
                </div>

                {/* QR Canvas Display */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-4 sm:p-5 text-center min-h-[240px] sm:min-h-[260px] flex items-center justify-center mb-5 w-full overflow-hidden">
                    <div className="p-2.5 sm:p-3 bg-white rounded-2xl shadow-xs border border-slate-100 inline-block transition-transform hover:scale-102 duration-150 max-w-full">
                        <div
                            ref={containerRef}
                            className="[&>canvas]:w-full [&>canvas]:max-w-[200px] sm:[&>canvas]:max-w-[240px] [&>canvas]:h-auto [&>canvas]:aspect-square [&>svg]:w-full [&>svg]:max-w-[200px] sm:[&>svg]:max-w-[240px] [&>svg]:h-auto flex items-center justify-center mx-auto"
                        />
                    </div>
                </div>

                {/* Style Customization */}
                <div className="space-y-4 mb-6">
                    {/* Dot Pattern Selection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Dot Shape</label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {DOT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setDotType(type.value)}
                                    className={cn(
                                        "py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center",
                                        dotType === type.value
                                            ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Presets */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Color</label>
                        <div className="flex gap-2 items-center">
                            {COLOR_PRESETS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setQrColor(color.value)}
                                    className={cn(
                                        "size-7 rounded-full border-2 transition-all cursor-pointer relative",
                                        qrColor === color.value
                                            ? "border-primary scale-110 shadow-xs"
                                            : "border-white hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.label}
                                >
                                    {qrColor === color.value && (
                                        <Check className="size-3.5 text-white absolute inset-0 m-auto drop-shadow-xs" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleDownload('png')}
                            disabled={isDownloading}
                            className="flex-1 gap-2 rounded-xl cursor-pointer"
                        >
                            <Download className="size-4" />
                            <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleDownload('svg')}
                            disabled={isDownloading}
                            className="flex-1 gap-2 rounded-xl cursor-pointer"
                        >
                            <Download className="size-4" />
                            <span>{isDownloading ? 'Exporting...' : 'Download SVG'}</span>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={handleCopy}
                        className="w-full gap-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                    >
                        {hasCopied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        <span>{hasCopied ? 'Link Copied!' : 'Copy Short Link'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
