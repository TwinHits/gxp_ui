//import api from "@/api/api";

import { ExperienceGain } from '@/common/types/experienceGain';

import experienceGains from '@/data/gxp_experience_gains.json';

export async function getExperienceGain(id: string): Promise<ExperienceGain> {
    const response = JSON.parse(experienceGains);
    for (const gain of response) {
        if (gain.id === id) {
            return gain;
        }
    }
    throw Error();
}


export async function getExperienceGains(): Promise<ExperienceGain[]> {
    const response = JSON.parse(experienceGains);
    return response;
}

export async function getExperienceGainsForRaider(raiderId: string): Promise<ExperienceGain[]> {
    const response = JSON.parse(experienceGains);
    const gains = [] as ExperienceGain[];
    for (const gain of response) {
        if (gain.raiderId === raiderId) {
            gains.push(gain);
        }
    }
    return gains;
}