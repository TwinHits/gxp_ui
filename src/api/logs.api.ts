import * as Api from '@/api/api';

import { Log } from '@/common/types/log';

import config from '@/../config.json';

export async function pullLogsFromWarcraftLogs(): Promise<Log[]> {
    return await Api.post(`${config.gxpApi.baseUrl}/logs/pull/`);
}

export async function createLog(log: Log): Promise<Log> {
    return await Api.post(`${config.gxpApi.baseUrl}/logs/`, log);
}

export async function getLog(id: string): Promise<Log> {
    return await Api.get(`${config.gxpApi.baseUrl}/logs/${id}`);
}

export async function getLogs(): Promise<Log[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/logs/`);
}

export async function updateLog(log: Log): Promise<Log> {
    return await Api.put(`${config.gxpApi.baseUrl}/logs/${log.logsCode}/`, log);
}

export async function deleteLog(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/logs/${id}/`);
}
