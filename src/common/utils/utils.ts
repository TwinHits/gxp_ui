import * as ExperienceLevelsApi from '@/api/experienceLevels.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';

import { ExperienceEvent } from '../types/experienceEvent';
import { ExperienceLevel } from '../types/experienceLevel';

export function initializeBackend() {
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
            'name': 'Raider',
            'experience_required': 240,
        },
    ] as ExperienceLevel[];

    for (const experienceLevel of levels) {
        ExperienceLevelsApi.createExperienceLevel(experienceLevel);
    }

    const events = [
        {
            'key': 'COMPLETE_RAID',
            'description': 'Completing a raid.',
            'value': 1,
            'template': '{name} completed {zone}.',
        },
        {
            'key': 'BOSS_KILL',
            'description': 'Killing a boss.',
            'value': 1,
            'template': '{name} defeated {encounter}.',
        },
        {
            'key': 'BOSS_KILL_FLASK',
            'description': 'Having a flask on during a boss kill.',
            'value': 1,
            'template': '{name} defeated {encounter} with a flask.',
        },
        {
            'key': 'BOSS_KILL_NO_FLASK',
            'description': 'Not having a flask on for a boss kill.',
            'value': -1,
            'template': '{name} defeated {encounter} while missing a flask.',
        },
        {
            'key': 'BOSS_KILL_FOOD',
            'description': 'Having food on during a boss kill.',
            'value': 1,
            'template': '{name} defeated {encounter} with food.',
        },
        {
            'key': 'BOSS_KILL_NO_FOOD',
            'description': 'Not having food on for a boss kill.',
            'value': -1,
            'template': '{name} defeated {encounter} while missing food.',
        },
        {
            'key': 'SIGNED_UP_ACCURATELY',
            'description': 'Signing up for the raid, including absent or late.',
            'value': 3,
            'template': '{name} signed up {sign_up} for {zone}.',
        },
        {
            'key': 'SIGNED_UP_INACCURATELY',
            'description': 'Signing up but not showing up to the raid with no warning.',
            'value': -3,
            'template': '{name} signed up {sign_up} for {zone} but was inaccurate.',
        },
    ] as ExperienceEvent[];

    for (const experienceEvent of events) {
        ExperienceEventsApi.createExperienceEvent(experienceEvent);
    }

    [
        {
           "main": "Tytenyte",
           "name":"Tytebyte",
        },
        {
           "main": "Wewoowewoo",
           "name":"Woowewoowe"
        },
        {
           "main": "Yakmon",
           "name":"Yakman"
        },
        {
           "main": "",
           "name":"Emesîs"
        },
        {
           "main": "Lumpe",
           "name": "Lumpé"
        },
        {
           "main":"Haydez",
           "name":"Haydes"
        },
        {
           "main":"Waragor",
           "name":"Waragore"
        },
        {
           "main":"Chanarach",
           "name":"Mimmosa"
        },
        {
           "main":"Dreadsails",
           "name":"Nelen"
        },
        {
           "main":"Moonnipplez",
           "name":"Baiil",
        },
        {
           "main":"Jinpachii",
           "name":"Djinnpachi"
        },
        {
           "main":"Biddybop",
           "name": "Shieet"
        },
        {
           "main":"Streeps",
           "name": "Strips",
        },
        {
           "main":"Hattérs",
           "name":"Menyokki"
        },
        {
           "main":"Hattérs",
           "name":"Wísp"
        },
        {
           "main":"Hattérs",
           "name":"Whísps"
        },
        {
            "main": "Yinnifer",
           "name":"Redheadscorp"
        },
        {
           "main": "Moonnipplez",
           "name":"Baiill"
        },
        {
           "main": "Wewoowewoo",
           "name":"Weewwoo"
        },
        {
           "main": "Tytenyte",
           "name":"Ataribarikar"
        },
        {
           "main": "Jfb",
           "name":"Agator"
        },
        {
           "main": "Nangus",
           "name": "Daiichi"
        },
        {
           "main": "Yakmon",
           "name":"Pointythings"
        },
        {
           "main": "Yinnifer",
           "name":"Vissenna"
        },
        {
           "main": "Streeps",
           "name":"Pine"
        },
        {
           "main": "Hanitoko",
           "name":"Moomooman"
        },
        {
           "main": "Showershank",
           "name":"Hitmayne"
        },
        {
           "main": "Yinnifer",
           "name":"Bobohizan"
        },
        {
           "main": "Yinnifer",
           "name":"Zinyra"
        },
        {
           "main": "Nangus",
           "name":"Squawkbox"
        }
     ]
}
