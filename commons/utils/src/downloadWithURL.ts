export function downloadURL(url: string, filename = 'download.png') {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
}

export default downloadURL;
