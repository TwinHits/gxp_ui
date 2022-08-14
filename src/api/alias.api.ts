import * as Api from "@/api/api";

import { Alias } from '@/common/types/Alias';

import config from '@/../config.json';

export async function createAlias(name: string, raiderId: string): Promise<Alias> {
    return await Api.post(`${config.gxpApi.baseUrl}/aliases/`, {
        name,
        raider: raiderId,
    }) as Alias;
}

export async function getAlias(id: string): Promise<Alias> {
    return await Api.get(`${config.gxpApi.baseUrl}/aliases/${id}`) as Alias;
}

export async function getAliases(): Promise<Alias[]> {
    return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/aliases/`) as Alias[];
}

export async function deleteAlias(id: string) {
    await Api.del(`${config.gxpApi.baseUrl}/aliases/${id}`);
}