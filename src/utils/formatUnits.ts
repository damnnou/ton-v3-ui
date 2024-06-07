export function formatUnits(amount: number, decimals: number): number {
    return amount / 10 ** decimals;
}
