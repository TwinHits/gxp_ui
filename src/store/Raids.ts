import { Log } from '@/common/types/log';
import { Raid } from '@/common/types/raid';

import * as LogsApi from '@/api/logs.api';
import * as RaidsApi from '@/api/raids.api';

export default {
    state: () => ({
        raids: [] as Raid[],
        raidsById: {} as Record<string, Raid>,
        logs: [] as Log[],
        logsById: {} as Record<string, Log>,
    }),
    mutations: {
        setRaids(state: any, raids: Raid[]) {
            state.raids = raids;
            for (const raid of raids) {
                state.raidsById[raid.id] = raid;
            }
        },
        setLogs(state: any, logs: Log[]) {
            state.logs = logs;
            for (const log of logs) {
                state.logsById[log.logsCode] = log;
            }
        },
    },
    actions: {
        async getLogs(context: any) {
            const raids = await RaidsApi.getRaids();
            const logs = await LogsApi.getLogs();

            const raidsByCode = {} as Record<string, Raid>;
            for (const raid of raids) {
                if (raid.log) {
                    raidsByCode[raid.log.logsCode] = raid;
                }
            }

            for (const log of logs) {
                log.raid = raidsByCode[log.logsCode];
            }

            context.commit('setRaids', raids);
            context.commit('setLogs', logs);

            return context.getters.logs;
        }
    },
    getters: {
        raids: (state: any) => {
            return state.raids;
        },
        raid: (state: any) => (id: string) => {
            return state.raidsbyId[id];
        },
        logs: (state: any) => {
            return state.logs;
        },
        log: (state: any) => (id: string) => {
            return state.logsById[id];
        },
    },
};
