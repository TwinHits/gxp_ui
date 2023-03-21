import { Raider } from '@/common/types/raider';

export default {
    state: () => ({
        raiders: [] as Raider[],
        activeRaiders: [] as Raider[],
        activeRaiderMains: [] as Raider[],
        raiderMains: [] as Raider[],
        raidersById: {} as Record<string, Raider>,
    }),
    mutations: {
        setRaiders(state: any, raiders: Raider[]) {
            state.raiders = [];
            state.activeRaiders = [];
            state.activeRaiderMains = [];
            state.raiderMains = [];
            state.raidersById = {};

            state.raiders = raiders;
            state.raiders.sort((lhs: Raider, rhs: Raider) => {
                return lhs.experience > rhs.experience ? -1 : 1;
            });

            for (const raider of raiders) {
                state.raidersById[raider.id] = raider;
                const active = raider.active;
                const isMain = raider.main === null;
                if (active) {
                    state.activeRaiders.push(raider);
                    if (isMain) {
                        state.activeRaiderMains.push(raider);
                        state.raiderMains.push(raider);
                    }
                } else if (isMain) {
                    state.raiderMains.push(raider);
                }
            }
        },
    },
    getters: {
        raiders: (state: any) => {
            return state.raiders;
        },
        raiderMains: (state: any) => {
            return state.raiderMains;
        },
        activeRaiders: (state: any) => {
            return state.activeRaiders;
        },
        activeRaiderMains: (state: any) => {
            return state.activeRaiderMains;
        },
        raider: (state: any) => (id: string) => {
            return state.raidersById[id];
        },
        raidersForIds: (state: any, getters: any) => (ids: string[]) => {
            if (ids) {
                return ids.map((id: string) => getters.raider(id));
            } else {
                return [];
            }
        },
    },
};
