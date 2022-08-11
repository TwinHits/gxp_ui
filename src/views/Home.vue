<template>
    <div class="containing-div">
        <v-row>
            <v-col />
            <v-col cols=2>
                <v-btn @click="showRaids = true">Raids</v-btn>
            </v-col>
            <v-col cols=2>
                <v-btn @click="createEvents">Create Events</v-btn>
            </v-col>
            <v-col cols=2>
                <v-btn @click="createLevels">Create Levels</v-btn>
            </v-col>
            <v-col />
        </v-row>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col class="player-nameplate-col" v-for="(n, columnIndex) in numberOfColumns" :key="rowIndex * numberOfColumns + columnIndex">
                <PlayerNameplate v-if="rowIndex * numberOfColumns + columnIndex < raiders.length" :raider="raiders[rowIndex * numberOfColumns + columnIndex]"/>
            </v-col>
        </v-row>
        <LogUploads :show="showRaids" @close="showRaids = false" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

import PlayerNameplate from '@/views/PlayerNameplate.vue';
import LogUploads from '@/views/LogUploads.vue';

import { Alt } from '@/common/types/alt';
import { Raider } from '@/common/types/raider';

import * as ExperienceUtils from '@/common/utils/experienceUtils';

import * as AltsApi from '@/api/alts.api';
import * as RaidersApi from '@/api/raiders.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceLevelsApi from '@/api/experienceLevels.api';

export default Vue.extend({
    components: { 
        PlayerNameplate,
        LogUploads,
    },
    data() {
        return {
            columns: 3,
            error: undefined,
            showRaids: false,
            raiders: [] as Raider[],
            alts: [] as Alt[],
        };
    },
    computed: {
        numberOfRows(): number {
            return this.raiders.length / this.columns ? Math.ceil(this.raiders.length / this.columns) : 0; // Don't divide by zero
        },
        numberOfColumns(): number {
            return this.raiders.length / this.numberOfRows ? Math.ceil(this.raiders.length / this.numberOfRows) : 0; // Don't divide by zero
        }
    },
    methods: {
        async createLevels() {
            ExperienceUtils.createDefaultLevels();
        },
        async createEvents() {
            ExperienceUtils.createDefaultEvents();
        }
    },
    async mounted() {
        const events = await ExperienceEventsApi.getExperienceEvents();
        this.$store.commit('setExperienceEvents', events);

        const levels = await ExperienceLevelsApi.getExperienceLevels();
        this.$store.commit('setExperienceLevels', levels);

        this.raiders = await RaidersApi.getRaiders();
        this.alts = await AltsApi.getAlts();
    }
});
</script>

<style scoped lang="scss">
.containing-div {
    width: 100%;
}

.player-nameplate-row {
    width: 100%;
}

.player-nameplate-col {
    width: 20%;
}
</style>