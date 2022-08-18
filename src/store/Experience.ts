import { ExperienceEvent } from '@/common/types/experienceEvent';
import { ExperienceLevel } from '@/common/types/experienceLevel';

export default {
    state: () => ({
        experienceLevels: [] as ExperienceLevel[],
        experienceEvents: {} as Record<string, ExperienceEvent>,
        iconsByExperienceEventId: {} as Record<string, string>,
    }),
    mutations: {
        setExperienceLevels(state: any, experienceLevels: ExperienceLevel[]) {
            state.experienceLevels = experienceLevels;
        },
        setExperienceEvents(state: any, experienceEvents: ExperienceEvent[]) {
            for (const event of experienceEvents) {
                state.experienceEvents[event.id] = event;
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
                'WEEKLY_DECAY': 'mdi-calendar-week-outline',
                'TOP_PERFORMANCE': 'mdi-star-circle-outline',
                'HIGH_PERFORMANCE': 'mdi-format-vertical-align-top',
                'MID_PERFORMANCE': 'mdi-format-align-top',
                'LOW_PERFORMANCE': 'mdi-format-align-bottom',
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
            // Return second lowest level if below zero
            if (experience <= 0) {
                return state.experienceLevels[state.experienceLevels.length - 2];
            }

            // Return highest experience level if there is no next
            if (experience >= state.experienceLevels[0].experience_required) {
                return state.experienceLevels[0]
            }

            for (const [index, level] of state.experienceLevels.entries()) {
                if (experience >= level.experience_required) {
                    return state.experienceLevels[index - 1];
                }
            }
        },
        experienceEvent: (state: any) => (id: string) => {
            return state.experienceEvents[id];
        },
        experienceEventIcon: (state: any) => (id: string) => {
            return state.iconsByExperienceEventId[id];
        },
    },
};
