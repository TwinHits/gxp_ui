import { ExperienceEvent } from "@/common/types/experienceEvent";
import { ExperienceLevel } from "@/common/types/experienceLevel";

export default {
    state: () => ({
        experienceLevels: [] as ExperienceLevel[],
        experienceEvents: {} as Record<string, ExperienceEvent>,
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
            for (const [index, level] of state.experienceLevels.entries()) {
                if (experience >= level.experience_required) {
                    return state.experienceLevels[index - 1];
                }
            }
            // Return highest experience level if there is no next
            return state.experienceLevels[0];
        },
        experienceEvent: (state: any) => (id: string) => {
            return state.experienceEvents[id];
        },
    },
};
