<template>
    <ModalDialog label="Raids" :show="show" @close="$emit('close')">
        <v-card-text>
            <LoadingCircle v-if="loading" :size="50" />
            <LogUploadItem v-else 
                v-for="log in logs" 
                :key="log.code" 
                :log="log" 
                :raid="log.raid" 
                :loading="log.loading" 
                @create="createRaid($event)"
                @delete="deleteRaid($event)"
                />
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import LoadingCircle from '@/views/common/LoadingCircle.vue';
import LogUploadItem from '@/views/LogUploadItem.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { Raid } from '@/common/types/raid';
import { Log } from '@/common/types/log';

import * as RaidsApi from '@/api/raids.api';
import * as LogsApi from '@/api/logs.api';

export default Vue.extend({
    components: {
        LoadingCircle,
        LogUploadItem,
        ModalDialog,
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
            logs: [] as Log[],
            logsByCode: {} as Record<string, Log>,
        }
    },
    methods: {
        async createRaid(create: Record<string, string>) {
            const log = this.logs.filter((log: Log) => log.code === create.code)[0]
            log.loading = true;
            const raid = await RaidsApi.createRaid(create.code, create.raidHelperEventId);
            log.raid = raid;
            log.loading = false;
        },
        deleteRaid(raid: Raid) {
            const log = this.logs.filter((log: Log) => log.code === raid.warcraftLogsId)[0]
            log.loading = true;
            RaidsApi.deleteRaid(raid.id);
            log.raid = undefined;
            log.loading = false;
        },

    },
    async mounted() {
        this.loading = true;

        const raids = await RaidsApi.getRaids();
        this.logs = await LogsApi.getLogs();

        this.logs.map((log: Log) => this.logsByCode[log.code] = log);
        raids.map((raid: Raid) => this.logsByCode[raid.warcraftLogsId].raid = raid);

        this.loading = false;
    }
});
</script>

<style scoped lang="scss">
</style>