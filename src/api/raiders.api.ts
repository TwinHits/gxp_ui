//import api from "@/api/api";

import { Raider } from '@/common/types/raider';

import raiders from '@/data/gxp_raiders.json';

export async function getRaider(id: string): Promise<Raider> {
    const response = JSON.parse(raiders);
    for (const raider of response) {
        if (raider.id === id) {
            return raider;
        }
    }
    throw Error();
}


export async function getRaiders(): Promise<Raider[]> {
    const response = JSON.parse(raiders);
    return response;
}