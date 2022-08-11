<template>
    <v-dialog v-model="show" width="66%">
        <v-card>
            <v-card-title>Raids</v-card-title>
            <v-card-actions>
                <v-btn @click="$emit('close')">Close</v-btn>
            </v-card-actions>
            <v-card-text>
                <LoadingCircle v-if="loading" :size="50" />
                <RaidUploadItem v-else 
                    v-for="log in logs" 
                    :key="log.code" 
                    :log="log" 
                    :raid="raidsByCode[log.code]"
                    @create="createRaid($event)"
                    @delete="deleteRaid($event)"
                    />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import LoadingCircle from '@/views/LoadingCircle.vue';
import RaidUploadItem from '@/views/RaidUploadItem.vue';

import { Raid } from '@/common/types/raid';
import { Log } from '@/common/types/log';

import * as RaidsApi from '@/api/raids.api';
import * as LogsApi from '@/api/logs.api';

export default Vue.extend({
    components: {
        LoadingCircle,
        RaidUploadItem,
    },
    props: {
        show: {
            required: true,
            type: Boolean
        },
    },
    data() {
        return {
            loading: false,
            raids: [] as Raid[],
            logs: [] as Log[],
            raidsByCode: {} as Record<string, Raid>,
        }
    },
    methods: {
        async createRaid(code: string) {
            const raid = await RaidsApi.createRaidFromLogs(code);
            this.raidsByCode[raid.warcraftLogsId] = raid;
        },
        deleteRaid(raid: Raid) {
            RaidsApi.deleteRaid(raid.id);
            if (this.raidsByCode[raid.warcraftLogsId]) {
                delete this.raidsByCode[raid.warcraftLogsId];
            }
        },

    },
    async mounted() {
        this.loading = true;

        this.raids = await RaidsApi.getRaids();
        this.logs = await LogsApi.getLogs();

        this.raids.map((raid: Raid) => this.raidsByCode[raid.warcraftLogsId] = raid);

        this.loading = false;
    }
});
</script>

<style scoped lang="scss">
</style>