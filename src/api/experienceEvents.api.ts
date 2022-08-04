//import api from "@/api/api";

import { ExperienceEvent } from '@/common/types/experienceEvent';

import experienceEvents from '@/data/gxp_experience_events.json';

export async function getExperienceEvent(id: string): Promise<ExperienceEvent> {
    const response = JSON.parse(experienceEvents);
    for (const event of response) {
        if (event.id === id) {
            return event;
        }
    }
    throw Error();
}


export async function getExperienceEvents(): Promise<ExperienceEvent[]> {
    const response = JSON.parse(experienceEvents);
    return response;
}