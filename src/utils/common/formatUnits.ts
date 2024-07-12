export function formatUnits(amount: number | bigint | string, decimals: number): string {
    const result = Number(amount) / 10 ** decimals;
    return result.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
