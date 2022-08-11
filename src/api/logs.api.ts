import * as Api from "@/api/api";

import { Log } from "@/common/types/log";

import config from '@/../config.json';

export async function getLogs(): Promise<Log[]> {
    return await Api.get(`${config.gxpApi.baseUrl}/logs/`) as Log[];
}