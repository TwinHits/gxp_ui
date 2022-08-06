import { Raider } from '@/common/types/raider';
import { Alt } from '@/common/types/alt';
import { Raid } from '@/common/types/raid';
import { ExperienceEvent } from '@/common/types/experienceEvent';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

import { v4 as uuidv4 } from 'uuid';

export function getNewUUID() {
    return uuidv4();
}

export function getRaiderFromAlt(alt: Alt, raiders: Raider[]): Raider | undefined {
    for (const raider of raiders) {
        if (raider.id === alt.raiderId) {
            return raider;
        }
    }
    return undefined;
}


export function getRaiderFromAltName(altName: string, alts: Alt[], raiders: Raider[]): Raider | undefined {
    for (const alt of alts) {
        if (altName === alt.name) {
            return getRaiderFromAlt(alt, raiders);
        }
    }
    return undefined;
}


export function getRaiderFromRaidersByName(name: string, raiders: Raider[]) {
    for (const raider of raiders) {
        if (raider.name === name) {
            return raider;
        }
    }
    return undefined;
}


export function generateExperienceEvents() {
    const experienceEvents = [
        {
            event: "Killing a boss",
            value: 1,
        },
        {
            event: "Completing an entire raid from start to finish ",
            value: 1,
        },
        {
            event: "Having a flask on during a boss kill ",
            value: 1,
        },
        {
            event: "Having food on during a boss kill ",
            value: 1,
        },
        {
            event: "Parsing 95 or higher on a boss kill",
            value: 1,
        },
        {
            event: "Signing up for the raid, including absent or late",
            value: 3,
        },
        {
            event: "Missing a boss kill (afk in raid only)",
            value: -1,
        },
        {
            event: "Signing up but not showing up to the raid with no warning",
            value: -3,
        },
        {
            event: "Missing any raid for any reason = -1 GXP per boss in the raid.",
            value: -1,
        },
        {
            event: "Not having a flask on for a boss kill",
            value: -1,
        },
        {
            event: "Not having food for a boss kill",
            value: -1,
        },
        {
            event: "Parsing below their classes average for a boss",
            value: -1,
        },
        {
            event: "Weekly Decay",
            value: -14,
        },

    ] as ExperienceEvent[];


    for (const experienceEvent of experienceEvents) {
        experienceEvent.id = getNewUUID()
    }

    return JSON.stringify(experienceEvents);
}


export function getRaidsFromLogs(raidLogs: any[], raiders: Raider[], alts: Alt[]): Raid[] {

    const raids = [] as Raid[];
    // Sort raid logs by date
    raidLogs.sort((lhs, rhs) => { return lhs.startTime > rhs.startTime ? -1 : 1;} )

    for (const [i, raidLog] of raidLogs.entries()) {
        const raid = {} as Raid;
        
        // Id
        raid.id = getNewUUID();

        // Warcraft logs code
        raid.logsCode = raidLog.code;

        // Get correct date format
        const date = new Date(raidLog.startTime) as Date;
        raid.timeStamp = DateTimeUtils.getUnixTimeFromDate(date);
        const dayOfWeek = date.getDay();

        // Is it optional?
        if (dayOfWeek == 2 || dayOfWeek == 4) {
            raid.optional = false;
        } else {
            raid.optional = true;
        }

        // What zone?
        raid.zone = raidLog.zone.name;

        raid.raiders = [];
        for (const player of raidLog.players) {

            // Get known raider by name
            let raider = getRaiderFromRaidersByName(player.name, raiders);
            if (!raider) {
                // Figure out known raider by alt name
                raider = getRaiderFromAltName(player.name, alts, raiders);
                if (!raider) {
                    // Is unknown raider
                    console.log(`Unknown Raider! ${player.name}`)
                    continue;
                }
            }

            // Is the raider multiboxing?
            if (!raid.raiders.includes(player)) {
                raid.raiders.push(raider.id);
            }
        }

        // Is it two logs from the same raid?
        const previouslyParsedRaid = raids[i-1];
        if (previouslyParsedRaid) {
            if (date.getDate() === DateTimeUtils.getDateFromUnixTime(previouslyParsedRaid.timeStamp).getDate()) {
                // Are they from the same zone?
                console.log("Detected two raids from the same day:");
                console.log(raid);
                console.log(previouslyParsedRaid)
                if (raid.zone === previouslyParsedRaid.zone) {
                    // Is the attendance the same?
                    // Does this matter?
                }
            }
        }

        raids.push(raid);
    }

    return raids;
}