<template>
    <ModalDialog label="Raids" :show="show" @close="$emit('close')">
        <v-data-table
            :headers="headers"
            :items="logs"
            :items-per-page="10"
            item-key="logsCode"
            class="elevation-1"
            :footer-props="{
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-arrow-left',
                nextIcon: 'mdi-arrow-right'
            }"
            no-data-text="No logs have been pulled from Wacraft Logs yet. Use the Pull button above."
        >
            <template v-slot:item.timestamp="{ item }">
                {{ getFormattedDate(item.timestamp) }}
            </template>
            <template v-slot:item.raidHelperEventId="{ item }">
                <v-text-field v-if="!item.raid" v-model="item.raidHelperEventId" dense />
                <template v-if="item.raid">{{ item.raidHelperEventId }}</template>
            </template>
            <template v-slot:item.actions="{ item }">
                <LoadingCircle v-if="item.loading" :size="25" />
                <IconButton v-if="!item.raid && !item.loading" icon="mdi-upload" @click="createRaid(item)" />
                <IconButton v-if="item.raid && !item.loading" icon="mdi-trash-can-outline" @click="deleteRaid(item)" />
            </template>
        </v-data-table>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import LoadingCircle from '@/views/common/LoadingCircle.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';
import IconButton from '@/views/common/IconButton.vue';

import { Raid } from '@/common/types/raid';
import { Log } from '@/common/types/log';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

import * as RaidsApi from '@/api/raids.api';
import * as LogsApi from '@/api/logs.api';

export default Vue.extend({
    components: {
        IconButton,
        LoadingCircle,
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
            headers: [
                {
                    text: 'Time',
                    value: 'timestamp',
                },
                { 
                    text: 'Warcraft Logs Report Code', 
                    value: 'logsCode' 
                },
                { 
                    text: 'Raid Helper Event Id', 
                    value: 'raidHelperEventId' 
                },
                {
                    text: 'Raid Id',
                    value: 'raid.id'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                }
            ],
        }
    },
    methods: {
        async pullLogs(): Promise<Log[]> {
            return await LogsApi.pullLogsFromWarcraftLogs();
        },
        async createRaid(log: Log) {
            // This method gives off false positives to es lint, so disabling that rule for those lines
            log.loading = true; 
            await LogsApi.updateLog(log); 
            log.raid = await RaidsApi.createRaid(log.logsCode, log.timestamp, log.zone, log.raidHelperEventId); // eslint-disable-line require-atomic-updates
            this.$emit('refreshRaiders');
            log.loading = false; // eslint-disable-line require-atomic-updates
        },
        deleteRaid(log: Log) {
            if (log.raid) {
                log.loading = true
                RaidsApi.deleteRaid(log.raid.id);
                log.raid = undefined;
                this.$emit('refreshRaiders');
                log.loading = false;
            }
        },
        getFormattedDate(timestamp: number) {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(timestamp));
        }
    },
    async mounted() {
        this.loading = true;

        const raids = await RaidsApi.getRaids();
        const logs = await LogsApi.getLogs();

        if (logs.length > 0) {
            const raidsByCode = {} as Record<string, Raid>;
            for (let raid of raids) {
                raidsByCode[raid.log.logsCode] = raid;
            }

            for (let log of logs) {
                log.raid = raidsByCode[log.logsCode];
                log.loading= false;
            }
        }

        this.logs = logs;
        this.loading = false;
    }
});
</script>

<style scoped lang="scss">
</style>