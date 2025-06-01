export function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
}