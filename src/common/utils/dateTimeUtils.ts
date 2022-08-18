export function getUnixTimeFromDate(date: Date): number {
    return date.valueOf();
}

export function getDateFromUnixTime(unixTime: number): Date {
    return new Date(unixTime);
}

export function formatDateTimeForDisplay(date: Date): string {
    return date.toLocaleString();
}

export function formatDateForDisplay(date: Date): string {
    return date.toDateString();
}
