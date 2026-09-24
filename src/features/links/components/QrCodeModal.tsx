import { X, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    shortUrl: string;
    shortCode: string;
}

export default function QrCodeModal({ isOpen, onClose, shortUrl, shortCode }: QrCodeModalProps) {
    if (!isOpen) return null;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `qrcode-${shortCode}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch {
            window.open(qrUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150 text-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                >
                    <X className="size-5" />
                </button>

                <h3 className="text-lg font-bold text-slate-900">QR Code</h3>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-xs mx-auto">{shortUrl}</p>

                <div className="my-6 p-4 bg-slate-50 rounded-xl inline-block border border-slate-100 shadow-inner">
                    <img src={qrUrl} alt="QR Code" className="size-52 mx-auto rounded-lg" />
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-1.5" onClick={() => window.open(shortUrl, '_blank')}>
                        <ExternalLink className="size-4" />
                        <span>Visit</span>
                    </Button>
                    <Button className="flex-1 gap-1.5" onClick={handleDownload}>
                        <Download className="size-4" />
                        <span>Download</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
