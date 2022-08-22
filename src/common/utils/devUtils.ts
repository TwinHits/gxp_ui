import * as ExperienceLevelsApi from '@/api/experienceLevels.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as AltsApi from '@/api/alts.api';
import * as AliasesApi from '@/api/aliases.api';
import * as RaidersApi from '@/api/raiders.api';
import * as RaidsApi from '@/api/raids.api';
import * as LogsApi from '@/api/logs.api';

import { ExperienceEvent } from '../types/experienceEvent';
import { ExperienceLevel } from '../types/experienceLevel';
import { Log } from '@/common/types/log';
import { Raider } from '@/common/types/raider';

import * as Logs from '@/data/gxp_logs.json';
import * as Raiders_export from '@/data/raiders_export';
import * as Raiders_final from '@/data/raiders_final';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export function initializeBackend() {
    initializeExperience();
    createLogsFromBackup();
    createRaidersFromBackup();
}

export function initializeExperience() {
    const levels = [
        {
            'name': 'Trial',
            'experience_required': 0,
        },
        {
            'name': 'Member',
            'experience_required': 40,
        },
        {
            'name': 'Tier 4 Raider',
            'experience_required': 80,
        },
        {
            'name': 'Tier 5 Raider',
            'experience_required': 120,
        },
        {
            'name': 'Tier 6 Raider',
            'experience_required': 160,
        },
    ] as ExperienceLevel[];

    for (const experienceLevel of levels) {
        ExperienceLevelsApi.createExperienceLevel(experienceLevel);
    }

    const events = [
        {
            'id': 'COMPLETE_RAID',
            'description': 'Completing a raid.',
            'value': 1,
            'template': '{name} completed {zone}.',
        },
        {
            'id': 'BOSS_KILL',
            'description': 'Killing a boss.',
            'value': 1,
            'template': '{name} defeated {encounter}.',
        },
        {
            'id': 'MISSED_BOSS_KILL',
            'description': 'Missing a boss',
            'value': -1,
            'template': '{name} did not participate in {encounter}.',
        },
        {
            'id': 'BOSS_KILL_FLASK',
            'description': 'Having a flask on during a boss kill.',
            'value': 1,
            'template': '{name} defeated {encounter} with a flask.',
        },
        {
            'id': 'BOSS_KILL_NO_FLASK',
            'description': 'Not having a flask on for a boss kill.',
            'value': -1,
            'template': '{name} defeated {encounter} while missing a flask.',
        },
        {
            'id': 'BOSS_KILL_FOOD',
            'description': 'Having food on during a boss kill.',
            'value': 1,
            'template': '{name} defeated {encounter} with food.',
        },
        {
            'id': 'BOSS_KILL_NO_FOOD',
            'description': 'Not having food on for a boss kill.',
            'value': -1,
            'template': '{name} defeated {encounter} while missing food.',
        },
        {
            'id': 'SIGNED_UP_ACCURATELY',
            'description': 'Signing up for the raid, including absent or late.',
            'value': 3,
            'template': '{name} signed up {sign_up} for {zone}.',
        },
        {
            'id': 'SIGNED_UP_INACCURATELY',
            'description': 'Signing up but not showing up to the raid with no warning.',
            'value': -3,
            'template': '{name} signed up {sign_up} for {zone} but was inaccurate.',
        },
        {
            'id': 'DECAY_PER_BOSS',
            'description': 'Decay for each boss killed.',
            'value': -3,
            'template': "{name}'s experience decayed since the guild killed {encounters_count} bosses.",
        },
        {
            'id': 'TOP_PERFORMANCE',
            'description': 'Performing in the top percent on warcraft logs.',
            'value': +2,
            'template': '{name} was a top performer for {encounter}!',
        },
        {
            'id': 'HIGH_PERFORMANCE',
            'description': 'Performing highly on warcraft logs.',
            'value': 1,
            'template': '{name} was a high performer for {encounter}.',
        },
        {
            'id': 'MID_PERFORMANCE',
            'description': 'Performing well on warcraft logs.',
            'value': 0,
            'template': '{name} was performed well for {encounter}.',
        },
        {
            'id': 'LOW_PERFORMANCE',
            'description': 'Performing poorly on warcraft logs.',
            'value': -1,
            'template': '{name} was a low performer for {encounter}.',
        },
    ] as ExperienceEvent[];

    for (const experienceEvent of events) {
        ExperienceEventsApi.createExperienceEvent(experienceEvent);
    }
}

export async function createLogsFromBackup() {
    for (const [index, log] of Object.entries(Logs)) {
        LogsApi.createLog(log);
    }
}

export async function getAllRaiders() {
    const raiders = await RaidersApi.getRaiders();
    console.log(raiders);
}

export async function getAllLogs() {
    const logs = await LogsApi.getLogs();
    for (const log of logs) {
        log.optional = ![2,4].includes(DateTimeUtils.getWeekdayFromUnixTime(log.timestamp));
    }
    console.log(logs)
}

export async function updateAllLogs() {
    for (const [index, log] of Object.entries(Logs)) {
        LogsApi.updateLog(log);
    }
}


export function assembleRaidersInitalState() {
    const raiders = [] as any[];
    const raiders_export_map = {} as Record<string, any>;
    for (const [index, raider_export] of Object.entries(Raiders_export)) {
        try {
            raiders_export_map[raider_export.name] = raider_export
        } catch(err) {
            console.log(err)
        }
    }

    for (const [index, raider_export] of Object.entries(Raiders_export)) {
        try {
            const raider = {
                name: raider_export.name,
                join_timestamp: raider_export.join_timestamp,
                active: raider_export.active,
            }
            raider.alts = raider_export.alts.map((a) => a.name)
            raider.aliases = raider_export.aliases.map((a) => a.name)
            raiders.push(raider)
        } catch(err) {
            console.log(err)
        }
    }
    console.log(raiders)
}


export async function createRaidersFromBackup() {
    const name_to_raider_obj = {}
    for (const [index, raider] of Object.entries(Raiders_final)) {
        if (raider && Object.keys(raider).length > 0 && !Array.isArray(raider)) {
            const raider_obj =  await RaidersApi.createRaider(raider.name, raider.join_timestamp)
            name_to_raider_obj[raider_obj.name] = raider_obj
        }
    }

    for (const [index, raider] of Object.entries(Raiders_final)) {
        if (raider && Object.keys(raider).length > 0 && !Array.isArray(raider)) {
            const raider_obj = name_to_raider_obj[raider.name];
            if (raider_obj && Object.keys(raider_obj).length > 0 && !Array.isArray(raider_obj)) {
                try {
                    for (const alias of raider.aliases) {
                        await AliasesApi.createAlias(alias, raider_obj.id);
                    }
                    for (const alt of raider.alts) {
                        const alt_raider_obj = name_to_raider_obj[alt];
                        await AltsApi.createAlt(alt_raider_obj.id, raider_obj.id);
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        }
    }
}

export function getOrderedCurrentExperienceFromRaiders(raiders: Raider[]) {
    const toPrint = {} as Record<string, number>;
    raiders.sort((rhs, lhs) => rhs.experience > lhs.experience ? -1 : 1)
    for (const raider of raiders)  {  
        if (raider.totalRaids > 0 && raider.experience > 0) {
            toPrint[raider.name] = raider.experience;
        }
    }
    console.log(toPrint)
}