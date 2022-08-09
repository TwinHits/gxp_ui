import { ExperienceLevel } from "@/common/types/experienceLevel";

export default {
    state: () => ({
        experienceLevels: undefined as ExperienceLevel[] | undefined,
    }),
    mutations: {
        setExperienceLevels(state: any, experienceLevels: ExperienceLevel[]) {
            state.experienceLevels = experienceLevels;
        },
    },
    getters: {
        experienceLevels: (state: any) => {
            return state.experienceLevels;
        },
        experienceLevel: (state: any) => (experience: number) => {
            for (const level of state.experienceLevels) {
                if (experience > level.experience_required) {
                    return level;
                }
            }
        },
        nextExperienceLevel: (state: any) => (experience: number) => {
            for (const [index, level] of state.experienceLevels.entries()) {
                if (experience > level.experience_required) {
                    return state.experienceLevels[index - 1];
                }
            }
        },
    },
};
