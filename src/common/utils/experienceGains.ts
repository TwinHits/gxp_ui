import { ExperienceGain } from "@/common/types/experienceGain";
import { Raid } from "@/common/types/raid";
import { Raider } from "@/common/types/raider";

import * as Utils from '@/common/utils/utils';

import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceGainsApi from '@/api/experienceGains.api';

export async function getGainsFromRaids(raids: Raid[]) {
    let gains = [] as ExperienceGain[];

    for (const raid of raids) {
        gains = gains.concat(await getGainsForAttendance(raid));
        console.log("completed a raid")
    }

    return gains;
}

export async function getGainsForAttendance(raid: Raid) {
    const event = await ExperienceEventsApi.getExperienceEvent("86e031b1-973d-47fb-a911-b428a00efad0");

    const gains = [] as ExperienceGain[];
    const raiderIds = raid.raiders;

    for (const raiderId of raiderIds) {
        gains.push({
            id: Utils.getNewUUID(),
            raiderId,
            raidId: raid.id,
            eventId: event.id,
            dateTimeStamp: raid.unixTimeStamp,
        });
    }

    return gains;
}

export async function calculateExperienceForRaider(raider: Raider): number {
    let experience = 0;
    const gains = await ExperienceGainsApi.getExperienceGainsForRaider(raider.id);
    for (const gain of gains) {
        const event = await ExperienceEventsApi.getExperienceEvent(gain.eventId);
        experience += event.gain;
    }
    return experience;
}

