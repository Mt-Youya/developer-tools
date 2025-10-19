import type { PromiseReturn } from "@/types/utils";

function isCrossOriginUrl(url: string) {
    const origin = location.host;
    return url.indexOf('data:') !== 0 && url.indexOf(origin) < 0;
};

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        if (isCrossOriginUrl(url)) {
            img.crossOrigin = 'Anonymous';
        }

        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image load error: ' + url));
    });
};

export function imageToPng(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return ""
    }
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return canvas.toDataURL('image/png');
};


export async function svgToPng(xml: string) {
    const base64 = window.btoa(
        encodeURIComponent(xml).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
        )
    );
    const image64 = `data:image/svg+xml;base64,${base64}`;
    const image = await loadImage(image64);
    return imageToPng(image);
};

export function readFile(file: File, dataType: string = 'DataURL'): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const fnName = `readAs${dataType}` as keyof FileReader;

        if (!reader[fnName]) {
            throw new Error('File read error, dataType not support');
        }

        reader.onerror = () => {
            reject(new Error('File read error'));
        };

        reader.onload = () => {
            resolve(reader.result);
        };

        (reader[fnName] as Function)(file);
    });
};

export function svgFile2Png(file: File) {
    return readFile(file, 'Text').then((text: PromiseReturn<typeof readFile>) => {
        if (typeof text === 'string') {
            return svgToPng(text);
        }
        throw new Error('Invalid SVG file content');
    });
}
