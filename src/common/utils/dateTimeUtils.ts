export function getUnixTimeFromDate(date: Date): number {
    return date.valueOf();
}

export function getDateFromUnixTime(unixTime: number): Date {
    return new Date(unixTime);
}

export function formatDateTimeForDisplay(date: Date): string {
    return date.toLocaleString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString();
}

export function getWeekdayFromUnixTime(unixTime: number): number {
    return getDateFromUnixTime(unixTime).getDay();
}
