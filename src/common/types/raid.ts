export interface Raid {
    id: string,
    logsCode: string,
    zone: string,
    unixTimeStamp: number,
    optional: boolean,
    raiders: string[],
}