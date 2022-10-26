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
                        <IconButton v-if="!pullLogsLoading" @click="pullLogs" icon="mdi-download-multiple" tooltip="Pull New Logs" />
                        <LoadingCircle v-else :size="25" />
                    </v-col>
                    <v-col md="auto" align="center">
                        <IconButton v-if="!createRaidsLoading" @click="createRaids" icon="mdi-upload-multiple" tooltip="Create All Raids" />
                        <LoadingCircle v-else :size="25" />
                    </v-col>
                    <v-col md="auto" align="center">
                        <IconButton v-if="!deleteRaidsLoading" @click="deleteRaids" icon="mdi-delete-sweep-outline" tooltip="Delete All Raids" />
                        <LoadingCircle v-else :size="25" />
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
                    <IconButton v-if="!item.raid && item.active" icon="mdi-content-save-outline" @click="updateLog(item)" tooltip="Save Raid" />
                    <IconButton v-if="!item.raid && item.active" icon="mdi-upload" @click="createRaid(item)" tooltip="Create Raid" />
                    <IconButton v-if="!item.raid && item.active" icon="mdi-archive-outline" @click="setLogActive(item, false)" tooltip="Archive Raid" />
                    <IconButton v-if="item.raid" icon="mdi-trash-can-outline" @click="deleteRaid(item)" tooltip="Delete Raid" />
                    <IconButton v-if="!item.active" icon="mdi-archive-off-outline" @click="setLogActive(item, true)" tooltip="Activate Raid"  />
                </template>
            </template>
        </v-data-table>
    </ModalDialog>
</template>

<script lang="ts">
import Vue from 'vue';

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
            pullLogsLoading: false,
            createRaidsLoading: false,
            deleteRaidsLoading: false,
        };
    },
    methods: {
        async pullLogs() {
            this.pullLogsLoading = true;
            await LogsApi.pullLogsFromWarcraftLogs();
            this.pullLogsLoading = false;
        },
        async createRaid(log: Log) {
            if (!log.raid && log.active) {
                log.loading = true;
                await LogsApi.updateLog(log);
                log.raid = await RaidsApi.createRaid(log.logsCode, log.timestamp, log.zone, log.raidHelperEventId);
                this.$emit('refreshRaiders');
                log.loading = false;
            }
        },
        async createRaids() {
            this.createRaidsLoading = true;
            for (const log of this.logs.reverse()) {
                if (!log.raid && log.active) {
                    log.loading = true;
                    await LogsApi.updateLog(log);
                    log.raid = await RaidsApi.createRaid(log.logsCode, log.timestamp, log.zone, log.raidHelperEventId);
                    log.loading = false;
                }
            }
            this.createRaidsLoading = false;
        },
        async updateLog(log: Log) {
            log.loading = true;
            const updatedLog = await LogsApi.updateLog(log);
            const index = this.logs.findIndex((l: Log) => l.logsCode === updatedLog.logsCode);
            this.logs[index] = updatedLog;
            log.loading = false;
        },
        async setLogActive(log: Log, active: boolean) {
            log.active = active;
            this.updateLog(log);
        },
        async deleteRaids() {
            this.deleteRaidsLoading = true;
            for (const log of this.logs) {
                if (log.raid) {
                    await RaidsApi.deleteRaid(log.raid.id);
                }
            }
            this.$emit('refreshRaiders');
            this.deleteRaidsLoading = false;
        },
        async deleteRaid(log: Log) {
            if (log.raid) {
                log.loading = true;
                await RaidsApi.deleteRaid(log.raid.id);
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
