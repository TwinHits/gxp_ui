import * as Api from '@/api/api';

import { Raid } from '@/common/types/raid';

import config from '@/../config.json';

export async function createRaid(
    logsCode: string,
    timestamp: number,
    zone: string,
    raidHelperEventId: number,
    reserve_raiders: string[],
    split_run: boolean,
): Promise<Raid> {
    return (await Api.post(`${config.gxpApi.baseUrl}/raids/`, {
        log: {
            logsCode,
            raidHelperEventId,
            timestamp,
            zone,
        },
        timestamp,
        zone,
        reserve_raiders,
        split_run,
    })) as Raid;
}

export async function getRaid(id: string): Promise<Raid> {
    return (await Api.get(`${config.gxpApi.baseUrl}/raids/${id}`)) as Raid;
}

export async function getRaids(): Promise<Raid[]> {
    return (await Api.getAllPaginated(`${config.gxpApi.baseUrl}/raids/`)) as Raid[];
}

export async function deleteRaid(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/raids/${id}/`);
}
