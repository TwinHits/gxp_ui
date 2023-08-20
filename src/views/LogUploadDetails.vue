<template>
    <div>
        <v-tabs v-model="tab" class="tabs-row" fixed-tabs>
            <v-tab :disabled="doesLogHaveRaid">{{ TABS.Upload }}</v-tab>
            <v-tab :disabled="!doesLogHaveRaid">{{ TABS.Raiders }}</v-tab>
            <v-tab>{{ TABS.Reserves }}</v-tab>
            <v-tab :disabled="!doesLogHaveRaid">{{ TABS.Issues }}</v-tab>
        </v-tabs>
        <v-card-text v-if="tab === 0">
            <v-row>
                <v-col>
                    <v-text-field label="Raid Helper Event Id" v-model="raidHelperEventId" dense />
                </v-col>
                <v-col>
                    <v-checkbox v-model="splitRun" label="Split Run" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="tab === 1">
            <v-row>
                <v-col>
                    <v-list dense class="raiders-list">
                        <v-list-item v-for="raider in log.raid.raiders" :key="raider.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ raider.name }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="tab === 2">
            <v-row>
                <v-col :cols="10">
                    <v-autocomplete
                        v-model="reserve"
                        :items="activeRaiderMains"
                        item-text="name"
                        return-object
                        label="Find Raider"
                        clearable
                        dense
                    ></v-autocomplete>
                </v-col>
                <v-col :cols="2" align="center">
                    <v-btn @click="addReserve" :disabled="isReserveAlreadySelected">Add Reserve</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-list dense class="reserves-list">
                        <v-list-item v-for="reserve in reserves" :key="reserve.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ reserve.name }}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-icon>
                                <IconButton icon="mdi-trash-can-outline" @click="removeReserve(reserve)" tooltip="Remove Reserve" />
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-if="tab === 3">
            <v-row>
                <v-col>
                    <v-list dense class="issues-list">
                        <v-list-item v-for="issue in log.raid.issues" :key="issue">
                            <v-list-item-content>
                                <v-list-item-title>{{ issue }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-row justify="space-between" align="center">
                <v-col :cols="2">
                    <v-btn @click="goBack">Back</v-btn>
                </v-col>
                <v-col :cols="2">
                    <v-btn v-if="!doesLogHaveRaid" @click="saveAndUpload">Save & Upload</v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Log } from '@/common/types/log';
import { Raider } from '@/common/types/raider';

import IconButton from '@/views/common/IconButton.vue';

const TABS = {
    Upload: 'Upload',
    Raiders: 'Raiders',
    Reserves: 'Reserves',
    Issues: 'Issues',
};

export default Vue.extend({
    components: {
        IconButton,
    },
    props: {
        log: {
            required: true,
            type: Object as PropType<Log>,
        },
    },
    data() {
        const tab = !this.log.raid ? TABS.Upload : TABS.Raiders;
        return {
            tab: tab,
            TABS: TABS,
            reserve: undefined as Raider | undefined,
            reserves: [] as Raider[],
            raiders: [] as Raider[],
            raidHelperEventId: undefined as number | undefined,
            splitRun: false as boolean,
        };
    },
    computed: {
        doesLogHaveRaid(): boolean {
            return !!this.log.raid;
        },
        activeRaiderMains(): Raider[] {
            return this.$store.getters.activeRaiderMains;
        },
        isReserveAlreadySelected(): boolean {
            if (this.reserve) {
                return this.reserves.includes(this.reserve);
            } else {
                return true;
            }
        },
    },
    methods: {
        initialize(log: Log) {
            this.reserves = this.$store.getters.raidersForIds(log.reserve_raiders);
            if (log.raid?.raiders) {
                this.raiders = this.$store.getters.raidersForIds(log.raid.raiders);
            }
            this.raidHelperEventId = log.raidHelperEventId;
            this.splitRun = log.split_run as boolean;
        },
        addReserve() {
            if (this.reserve) {
                this.reserves.push(this.reserve);
                this.reserve = undefined;
            }
        },
        removeReserve(reserve: Raider) {
            this.reserves.splice(this.reserves.findIndex((r: Raider) => r.id === reserve.id, 1));
        },
        saveAndUpload() {
            const reserveIds = this.reserves.map((r: Raider) => r.id);
            const raidHelperEventId = this.raidHelperEventId;
            this.$emit('saveAndUpload', raidHelperEventId, reserveIds, this.splitRun);
        },
        goBack() {
            this.$emit('goBack');
        },
    },
    mounted() {
        this.initialize(this.log);
    },
    watch: {
        log(newValue) {
            this.initialize(newValue);
        },
    },
});
</script>

<style scoped lang="scss">
@import '@/style/Colors.scss';

.reserves-list,
.raiders-list,
.issues-list {
    background-color: $foreground;
}

.reserves-list {
    margin: 0vh 1vw;
}
</style>
