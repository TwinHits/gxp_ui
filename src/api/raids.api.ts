//import api from "@/api/api";

import { Raid } from '@/common/types/raid';

import raids from '@/data/gxp_raids.json';

export async function getRaid(id: string): Promise<Raid> {
    const response = JSON.parse(raids);
    for (const raid of response) {
        if (raid.id === id) {
            return raid;
        }
    }
    throw Error();
}


export async function getRaids(): Promise<Raid[]> {
    const response = JSON.parse(raids);
    return response;
}