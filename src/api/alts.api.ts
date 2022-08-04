//import api from "@/api/api";

import { Alt } from '@/common/types/alt';

import alts from '@/data/gxp_alts.json';

export async function getAlt(id: string): Promise<Alt> {
    const response = JSON.parse(alts);
    for (const alt of response) {
        if (alt.id === id) {
            return alt;
        }
    }
    throw Error();
}


export async function getAlts(): Promise<Alt[]> {
    const response = JSON.parse(alts);
    return response;
}