import { Raider } from '@/common/types/raider';

export default {
    state: () => ({
        raiders: [] as Raider[],
        activeRaiders: [] as Raider[],
        activeRaiderMains: [] as Raider[],
        raidersById: {} as Record<string, Raider>,
    }),
    mutations: {
        setRaiders(state: any, raiders: Raider[]) {
            state.raiders = raiders;
            raiders.map((r: Raider) => state.raidersById[r.id] = r);
        },
        setActiveRaiders(state: any, activeRaiders: Raider[]) {
            state.activeRaiders = activeRaiders;
            activeRaiders.map((r: Raider) => state.raidersById[r.id] = r);
        },
        setActiveRaiderMains(state: any, activeRaiderMains: Raider[]) {
            state.activeRaiderMains = activeRaiderMains;
            activeRaiderMains.map((r: Raider) => state.raidersById[r.id] = r);
        },
    },
    getters: {
        raiders: (state: any) => {
            return state.raiders;
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
    },
};
