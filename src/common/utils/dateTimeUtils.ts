export function getUnixTimeFromDate(date: Date) {
    return date.valueOf();
}

export function getDateFromUnixTime(unixTime: number) {
    return new Date(unixTime);
}