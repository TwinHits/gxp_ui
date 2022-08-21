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
                nextIcon: 'mdi-arrow-right',
            }"
            no-data-text="No logs have been pulled from Wacraft Logs yet. Use the Pull button above."
        >
            <template v-slot:top>
                <v-row class="top-toolbar" justify="end">
                    <v-col md="auto" align="center">
                        <IconButton @click="pullLogs" icon="mdi-download-multiple" />
                    </v-col>
                    <v-col md="auto" align="center">
                        <IconButton @click="createRaids" icon="mdi-upload-multiple" />
                    </v-col>
                </v-row>
            </template>
            <template v-slot:item.timestamp="{ item }">
                {{ getFormattedDate(item.timestamp) }}
            </template>
            <template v-slot:item.raid="{ item }">
                <v-icon v-if="item.raid" color="green">mdi-checkbox-marked</v-icon>
            </template>
            <template v-slot:item.optional="{ item }">
                <v-icon v-if="!item.optional">mdi-asterisk</v-icon>
            </template>
            <template v-slot:item.raidHelperEventId="{ item }">
                <v-text-field v-if="!item.raid" v-model="item.raidHelperEventId" dense />
                <template v-if="item.raid">{{ item.raidHelperEventId }}</template>
            </template>
            <template v-slot:item.actions="{ item }">
                <LoadingCircle v-if="item.loading" :size="25" />
                <template v-else>
                    <IconButton v-if="!item.raid && item.active" icon="mdi-content-save-outline" @click="updateLog(item)" />
                    <IconButton v-if="!item.raid && item.active" icon="mdi-upload" @click="createRaid(item)" />
                    <IconButton
                        v-if="!item.raid && item.active"
                        icon="mdi-archive-outline"
                        @click="setLogActive(item, false)"
                    />
                    <IconButton v-if="item.raid" icon="mdi-trash-can-outline" @click="deleteRaid(item)" />
                    <IconButton v-if="!item.active" icon="mdi-archive-off-outline" @click="setLogActive(item, true)" />
                </template>
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
            type: Boolean,
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
                    text: 'Raid',
                    value: 'zone',
                },
                {
                    text: 'Warcraft Logs Report Code',
                    value: 'logsCode',
                },
                {
                    text: 'Raid Helper Event Id',
                    value: 'raidHelperEventId',
                },
                {
                    text: 'Uploaded',
                    value: 'raid',
                    align: 'center',
                    width: '12vh',
                },
                {
                    text: 'Main Raid',
                    value: 'optional',
                    align: 'center',
                    width: '12vh',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                    align: 'center',
                    width: '15vh',
                },
            ],
        };
    },
    methods: {
        async pullLogs(): Promise<Log[]> {
            return await LogsApi.pullLogsFromWarcraftLogs();
        },
        async createRaid(log: Log) {
            // This method gives off false positives to es lint, so disabling that rule for those lines
            if (!log.raid && log.active) {
                log.loading = true;
                await LogsApi.updateLog(log);
                log.raid = await RaidsApi.createRaid(log.logsCode, log.timestamp, log.zone, log.raidHelperEventId); // eslint-disable-line require-atomic-updates
                this.$emit('refreshRaiders');
                log.loading = false; // eslint-disable-line require-atomic-updates
            }
        },
        async createRaids() {
            // This method gives off false positives to es lint, so disabling that rule for those lines
            for (const log of this.logs.reverse()) {
                if (!log.raid && log.active) {
                    log.loading = true;
                    await LogsApi.updateLog(log);
                    log.raid = await RaidsApi.createRaid(log.logsCode, log.timestamp, log.zone, log.raidHelperEventId); // eslint-disable-line require-atomic-updates
                    log.loading = false; // eslint-disable-line require-atomic-updates
                }
            }
        },
        async updateLog(log: Log) {
            log.loading = true;
            const updatedLog = await LogsApi.updateLog(log);
            const index = this.logs.findIndex((l: Log) => l.logsCode === updatedLog.logsCode);
            this.logs[index] = updatedLog;
            log.loading = false; // eslint-disable-line require-atomic-updates
        },
        async setLogActive(log: Log, active: boolean) {
            log.active = active;
            this.updateLog(log);
        },
        deleteRaid(log: Log) {
            if (log.raid) {
                log.loading = true;
                RaidsApi.deleteRaid(log.raid.id);
                log.raid = undefined;
                this.$emit('refreshRaiders');
                log.loading = false;
            }
        },
        getFormattedDate(timestamp: number) {
            return DateTimeUtils.formatDateTimeForDisplay(DateTimeUtils.getDateFromUnixTime(timestamp));
        },
    },
    async mounted() {
        this.loading = true;

        const raids = await RaidsApi.getRaids();
        const logs = await LogsApi.getLogs();

        if (logs.length > 0) {
            const raidsByCode = {} as Record<string, Raid>;
            for (let raid of raids) {
                if (raid.log) {
                    raidsByCode[raid.log.logsCode] = raid;
                }
            }

            for (let log of logs) {
                log.raid = raidsByCode[log.logsCode];
                log.loading = false;
            }
        }

        this.logs = logs;
        this.loading = false;
    },
});
</script>

<style scoped lang="scss">
.top-toolbar {
    margin-right: 1vw;
}
</style>
