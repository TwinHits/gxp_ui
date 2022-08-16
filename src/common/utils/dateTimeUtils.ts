export function getUnixTimeFromDate(date: Date): number {
    return date.valueOf();
}

export function getDateFromUnixTime(unixTime: number): Date {
    return new Date(unixTime);
}

export function formatDateForDisplay(date: Date): string {
    return date.toLocaleString();
}

export function getWeeksSinceUnixTime(unixTime: number): number {
    const now = new Date().valueOf();
    return Math.round((now - unixTime * 1000) / (7 * 24 * 60 * 60 * 1000));
}