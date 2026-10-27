export async function shareImage(blob, filename) {
    await navigator.share({ files: [new File([blob], filename, { type: blob.type })] });
}

export function saveImage(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyImage(blob) {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}
