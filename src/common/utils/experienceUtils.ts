import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceLevelsApi from '@/api/experienceLevels.api';
import { ExperienceEvent } from '../types/experienceEvent';
import { ExperienceLevel } from '../types/experienceLevel';

export async function createDefaultLevels() {
    const levels = [
        {
            "name": "Trial",
            "experience_required": 0
        },
        {
            "name": "Member",
            "experience_required": 80
        },
        {
            "name": "Raider",
            "experience_required": 240
        }
    ] as ExperienceLevel[];

    for (const experienceLevel of levels) {
        ExperienceLevelsApi.createExperienceLevel(experienceLevel);
    }
}


export async function createDefaultEvents() {
    const events = [{
        "key": "COMPLETE_RAID",
        "description": "Completing a raid.",
        "value": 1,
        "template": "{name} completed {zone} on {date}."
    },
    {
        "key": "BOSS_KILL",
        "description": "Killing a boss.",
        "value": 1,
        "template": "{name} defeated {encounter} at {datetime}."
    },
    {
        "key": "BOSS_KILL_FLASK",
        "description": "Having a flask on during a boss kill.",
        "value": 1,
        "template": "{name} defeated {encounter} with a flask."
    },
    {
        "key": "BOSS_KILL_NO_FLASK",
        "description": "Not having a flask on for a boss kill.",
        "value": -1,
        "template": "{name} defeated {encounter} while missing a flask."
    },
    {
        "key": "BOSS_KILL_FOOD",
        "description": "Having food on during a boss kill.",
        "value": 1,
        "template": "{name} defeated {encounter} with food."
    },
    {
        "key": "BOSS_KILL_NO_FOOD",
        "description": "Not having food on for a boss kill.",
        "value": -1,
        "template": "{name} defeated {encounter} while missing food."
    },
    {
        "key": "SIGNED_UP_ACCURATELY",
        "description": "Signing up for the raid, including absent or late.",
        "value": 3,
        "template": "{name} signed up {sign_up} for {zone} on {date}."
    },
    {
        "key": "SIGNED_UP_INACCURATELY",
        "description": "Signing up but not showing up to the raid with no warning.",
        "value": -3,
        "template": "{name} signed up {sign_up} for {zone} on {date} but was inaccurate."
    }] as ExperienceEvent[];
 
    for (const experienceEvent of events) {
        ExperienceEventsApi.createExperienceEvent(experienceEvent);
    }
}
