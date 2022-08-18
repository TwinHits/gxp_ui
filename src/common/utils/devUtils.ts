import * as ExperienceLevelsApi from '@/api/experienceLevels.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as AltsApi from '@/api/alts.api';
import * as AliasesApi from '@/api/aliases.api';
import * as RaidersApi from '@/api/raiders.api';
import * as RaidsApi from '@/api/raids.api';
import * as LogsApi from '@/api/logs.api';

import { ExperienceEvent } from '../types/experienceEvent';
import { ExperienceLevel } from '../types/experienceLevel';
import { Log } from "@/common/types/log";

import * as Logs from '@/data/gxp_logs.json';

export function initializeBackend() {
   initializeExperience();
   createLogsFromBackup();
}

export function initializeExperience() {
    const levels = [
        {
            'name': 'Trial',
            'experience_required': 0,
        },
        {
            'name': 'Member',
            'experience_required': 80,
        },
        {
            'name': 'Tier 7 Raider',
            'experience_required': 240,
        },
        {
            'name': 'Tier 8 Raider',
            'experience_required': 480,
        },
        {
            'name': 'Tier 9 Raider',
            'experience_required': 960,
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
            'template': "{name} did not participate in {encounter}.",
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
            'id': 'WEEKLY_DECAY',
            'description': 'Every week, experience decays to encourage consistent participation.',
            'value': -14,
            'template': "{name}'s experience decayed this week.",
        },
        {
            'id': 'TOP_PERFORMANCE',
            'description': 'Performing in the top percent on warcraft logs.',
            'value': +2,
            'template': "{name} was a top performer for {encounter}!",
        },
        {
            'id': 'HIGH_PERFORMANCE',
            'description': 'Performing highly on warcraft logs.',
            'value': 1,
            'template': "{name} was a high performer for {encounter}.",
        },
        {
            'id': 'MID_PERFORMANCE',
            'description': 'Performing well on warcraft logs.',
            'value': 0,
            'template': "{name} was performed well for {encounter}.",
        },
        {
            'id': 'LOW_PERFORMANCE',
            'description': 'Performing poorly on warcraft logs.',
            'value': -1,
            'template': "{name} was a low performer for {encounter}.",
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
   const raiders = await LogsApi.getLogs();
   console.log(raiders);
}