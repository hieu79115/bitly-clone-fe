import QRCodeStyling, { type DotType, type CornerSquareType } from 'qr-code-styling';

export type FrameStyle = 'card' | 'outline' | 'minimal' | 'none';

export interface ExportQrConfig {
    data: string;
    dotsType: DotType;
    cornersSquareType?: CornerSquareType;
    qrColor: string;
    logoUrl?: string;
    frameStyle: FrameStyle;
    fileName: string;
    extension: 'png' | 'svg';
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
) {
    if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
    } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

export async function exportStyledQrCode({
    data,
    dotsType,
    cornersSquareType = 'extra-rounded',
    qrColor,
    logoUrl,
    frameStyle,
    fileName,
    extension,
}: ExportQrConfig): Promise<void> {
    const rawQrSize = 800;

    const qrInstance = new QRCodeStyling({
        width: rawQrSize,
        height: rawQrSize,
        data: data.trim() || 'https://google.com',
        margin: 0,
        dotsOptions: {
            color: qrColor,
            type: dotsType,
        },
        cornersSquareOptions: {
            type: cornersSquareType,
            color: qrColor,
        },
        cornersDotOptions: {
            type: 'dot',
            color: qrColor,
        },
        image: logoUrl,
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 10,
            imageSize: 0.32,
            hideBackgroundDots: true,
        },
        backgroundOptions: {
            color: '#ffffff',
        },
    });

    if (extension === 'png') {
        const rawBlob = await qrInstance.getRawData('png');
        if (!rawBlob) throw new Error('Failed to generate PNG blob');

        const objectUrl = URL.createObjectURL(rawBlob);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = objectUrl;
        });

        const totalSize = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = totalSize;
        canvas.height = totalSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            throw new Error('Canvas 2D context not available');
        }

        // Draw background & frames based on frameStyle
        if (frameStyle === 'card') {
            // Fill background canvas with white
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, totalSize, totalSize);

            // Card container coordinates
            const margin = 48;
            const cardWidth = totalSize - margin * 2;
            const cardHeight = totalSize - margin * 2;
            const cornerRadius = 56;

            // Draw Card Background
            drawRoundedRect(ctx, margin, margin, cardWidth, cardHeight, cornerRadius);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Card Border (sleek and crisp)
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#e2e8f0';
            ctx.stroke();

            // Draw QR code centered inside the card
            const qrPadding = 112;
            const innerSize = totalSize - qrPadding * 2;
            ctx.drawImage(img, qrPadding, qrPadding, innerSize, innerSize);
        } else if (frameStyle === 'outline') {
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, totalSize, totalSize);

            // Clean crisp square border
            const borderInset = 40;
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#cbd5e1';
            ctx.strokeRect(borderInset, borderInset, totalSize - borderInset * 2, totalSize - borderInset * 2);

            const qrPadding = 96;
            const innerSize = totalSize - qrPadding * 2;
            ctx.drawImage(img, qrPadding, qrPadding, innerSize, innerSize);
        } else if (frameStyle === 'minimal') {
            // White background with standard quiet-zone margin (no line)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, totalSize, totalSize);

            const qrPadding = 80;
            const innerSize = totalSize - qrPadding * 2;
            ctx.drawImage(img, qrPadding, qrPadding, innerSize, innerSize);
        } else {
            // 'none': raw edge-to-edge
            ctx.drawImage(img, 0, 0, totalSize, totalSize);
        }

        URL.revokeObjectURL(objectUrl);

        // Download PNG
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // SVG Vector export
        const rawBlob = await qrInstance.getRawData('svg');
        if (!rawBlob) throw new Error('Failed to generate SVG blob');
        const rawSvgText = await rawBlob.text();

        let finalSvg = rawSvgText;

        if (frameStyle === 'card') {
            const cardWidth = 360;
            const cardHeight = 360;
            const cardInset = 14;
            const cardRadius = 24;
            const qrOffset = 36;
            const qrScale = 288 / rawQrSize;

            const parser = new DOMParser();
            const doc = parser.parseFromString(rawSvgText, 'image/svg+xml');
            const innerContent = doc.documentElement.innerHTML;

            finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${cardWidth} ${cardHeight}" width="1080" height="1080">
  <rect x="${cardInset}" y="${cardInset}" width="${cardWidth - cardInset * 2}" height="${cardHeight - cardInset * 2}" rx="${cardRadius}" fill="#ffffff" stroke="#e2e8f0" stroke-width="2.5" />
  <g transform="translate(${qrOffset}, ${qrOffset}) scale(${qrScale})">
    ${innerContent}
  </g>
</svg>`;
        } else if (frameStyle === 'outline') {
            const cardWidth = 360;
            const cardHeight = 360;
            const cardInset = 14;
            const qrOffset = 36;
            const qrScale = 288 / rawQrSize;

            const parser = new DOMParser();
            const doc = parser.parseFromString(rawSvgText, 'image/svg+xml');
            const innerContent = doc.documentElement.innerHTML;

            finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${cardWidth} ${cardHeight}" width="1080" height="1080">
  <rect x="${cardInset}" y="${cardInset}" width="${cardWidth - cardInset * 2}" height="${cardHeight - cardInset * 2}" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" />
  <g transform="translate(${qrOffset}, ${qrOffset}) scale(${qrScale})">
    ${innerContent}
  </g>
</svg>`;
        } else if (frameStyle === 'minimal') {
            const cardWidth = 360;
            const cardHeight = 360;
            const qrOffset = 36;
            const qrScale = 288 / rawQrSize;

            const parser = new DOMParser();
            const doc = parser.parseFromString(rawSvgText, 'image/svg+xml');
            const innerContent = doc.documentElement.innerHTML;

            finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${cardWidth} ${cardHeight}" width="1080" height="1080">
  <rect width="100%" height="100%" fill="#ffffff" />
  <g transform="translate(${qrOffset}, ${qrOffset}) scale(${qrScale})">
    ${innerContent}
  </g>
</svg>`;
        }

        const svgBlob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
        const objectUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }
}
