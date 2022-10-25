import { ExperienceEvent } from '@/common/types/experienceEvent';
import { ExperienceLevel } from '@/common/types/experienceLevel';

import * as Colors from '@/common/constants/colors';

export default {
    state: () => ({
        experienceEvents: [] as ExperienceEvent[],
        experienceLevels: [] as ExperienceLevel[],
        experienceEventsById: {} as Record<string, ExperienceEvent>,
        iconsByExperienceEventId: {} as Record<string, string>,
        colorsByExperienceEventId: {} as Record<string, string>,
        colorsByExperienceLevelId: {} as Record<string, string>,
    }),
    mutations: {
        setExperienceLevels(state: any, experienceLevels: ExperienceLevel[]) {
            state.experienceLevels = experienceLevels;
        },
        setExperienceEvents(state: any, experienceEvents: ExperienceEvent[]) {
            state.experienceEvents = experienceEvents;
            for (const event of experienceEvents) {
                state.experienceEventsById[event.id] = event;
            }
        },
        setExperienceEventIcons(state: any) {
            state.iconsByExperienceEventId = {
                'COMPLETE_RAID': 'mdi-check-bold',
                'BOSS_KILL': 'mdi-skull-scan-outline',
                'BOSS_KILL_FLASK': 'mdi-flask-empty-outline',
                'BOSS_KILL_NO_FLASK': 'mdi-flask-empty-off-outline',
                'BOSS_KILL_FOOD': 'mdi-food-drumstick-outline',
                'BOSS_KILL_NO_FOOD': 'mdi-food-drumstick-off-outline',
                'SIGNED_UP_ACCURATELY': 'mdi-calendar-check-outline',
                'SIGNED_UP_INACCURATELY': 'mdi-calendar-remove-outline',
                'DECAY_PER_BOSS': 'mdi-calendar-week-outline',
                'TOP_PERFORMANCE': 'mdi-star-circle-outline',
                'HIGH_PERFORMANCE': 'mdi-format-vertical-align-top',
                'MID_PERFORMANCE': 'mdi-format-align-top',
                'LOW_PERFORMANCE': 'mdi-format-align-bottom',
                'PREV_EXPAC_RAID': 'mdi-history',
            };
        },
        setExperienceEventColors(state: any) {
            state.colorsByExperienceEventId = {
                'COMPLETE_RAID': Colors.PURPLE,
                'BOSS_KILL': Colors.PURPLE,
                'BOSS_KILL_FLASK': Colors.BLUE,
                'BOSS_KILL_NO_FLASK': Colors.GREY,
                'BOSS_KILL_FOOD': Colors.BLUE,
                'BOSS_KILL_NO_FOOD': Colors.GREY,
                'SIGNED_UP_ACCURATELY': Colors.PURPLE,
                'SIGNED_UP_INACCURATELY': Colors.GREY,
                'DECAY_PER_BOSS': Colors.BLUE,
                'TOP_PERFORMANCE': Colors.ORANGE,
                'HIGH_PERFORMANCE': Colors.BLUE,
                'MID_PERFORMANCE': Colors.GREEN,
                'LOW_PERFORMANCE': Colors.GREY,
                'PREV_EXPAC_RAID': Colors.PURPLE,
            };
        },
        setExperienceLevelColors(state: any) {
            state.colorsByExperienceLevelId = {
                'dad41d51-410a-4d46-b564-9bb12f1461d4': Colors.ORANGE,
                '06ae3d66-7145-4aaf-b44e-22ea23b6071f': Colors.PURPLE,
                'b9a60e46-6c8f-4c2c-b00c-4d4a7480e499': Colors.PURPLE,
                '8505187f-ae2e-4548-931a-8f13448cc2dc': Colors.BLUE,
                '47edaf8c-dd92-485f-b55a-396b755f6893': Colors.GREY,
            };
        },
    },
    getters: {
        experienceLevels: (state: any) => {
            return state.experienceLevels;
        },
        experienceLevel: (state: any) => (experience: number) => {
            for (const level of state.experienceLevels) {
                if (experience >= level.experience_required) {
                    return level;
                }
            }
            // Return lowest experience level if there is no matching level
            return state.experienceLevels[state.experienceLevels.length - 1];
        },
        nextExperienceLevel: (state: any) => (experience: number) => {
            // Return highest experience level if there is no next
            if (experience >= state.experienceLevels[state.experienceLevels.length - 1].experience_required) {
                return state.experienceLevels[state.experienceLevels.length - 1];
            }
            for (const [index, level] of state.experienceLevels.entries()) {
                if (experience < level.experience_required) {
                    return state.experienceLevels[index];
                }
            }
        },
        experienceEvents: (state: any) => {
            return state.experienceEvents;
        },
        experienceEvent: (state: any) => (id: string) => {
            return state.experienceEventsById[id];
        },
        experienceEventIcon: (state: any) => (id: string) => {
            return state.iconsByExperienceEventId[id];
        },
        experienceEventColor: (state: any) => (id: string) => {
            return state.colorsByExperienceEventId[id];
        },
        experienceLevelColor: (state: any) => (id: string) => {
            return state.colorsByExperienceLevelId[id];
        },
    },
};
