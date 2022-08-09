import * as Api from "@/api/api";

import { Raid } from '@/common/types/raid';

import config from '@/../config.json';

export async function getRaid(id: string): Promise<Raid> {
    return await Api.get(`${config.gxpApi.baseUrl}/raids/${id}`) as Raid;
}


export async function getRaids(): Promise<Raid[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/raids/`) as Raid[];
}