export function hexToRgb(hex: string): [number, number, number] {
    let bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))) // Clamp values
        .toString(16).padStart(2, '0')).join('');
}