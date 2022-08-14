<template>
    <div class="containing-div">
        <v-row>
            <v-col />
            <v-col cols=2>
                <v-btn @click="showRaids = true">Raids</v-btn>
            </v-col>
            <v-col cols=2>
                <v-btn @click="showCreateRaider = true">Create Raider</v-btn>
            </v-col>
            <v-col cols=2>
                <v-btn @click="initialize">Initialize</v-btn>
            </v-col>
        </v-row>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col class="player-nameplate-col" v-for="(n, columnIndex) in numberOfColumns" :key="rowIndex * numberOfColumns + columnIndex">
                <PlayerNameplate v-if="rowIndex * numberOfColumns + columnIndex < raiders.length" :raider="raiders[rowIndex * numberOfColumns + columnIndex]" @refreshRaiders="getRaiders"/>
            </v-col>
        </v-row>
        <LogUploads :show="showRaids" @close="showRaids = false" />
        <CreateRaiderModal :show="showCreateRaider" @close="showCreateRaider = false" @create="createRaider" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import CreateRaiderModal from '@/views/CreateRaiderModal.vue';
import LogUploads from '@/views/LogUploads.vue';
import PlayerNameplate from '@/views/PlayerNameplate.vue';

import { Raider } from '@/common/types/raider';

import * as Utils from '@/common/utils/utils';

import * as RaidersApi from '@/api/raiders.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceLevelsApi from '@/api/experienceLevels.api';

export default Vue.extend({
    components: { 
        PlayerNameplate,
        LogUploads,
        CreateRaiderModal,
    },
    data() {
        return {
            columns: 3,
            error: undefined,
            showRaids: false,
            showCreateRaider: false,
            raiders: [] as Raider[],
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
        async getRaiders() {
            this.raiders = await RaidersApi.getRaiders();

            const raiderToIdMap = new Map();
            for (let raider of this.raiders) {
                raiderToIdMap.set(raider.id, raider);
            }

            for (let raider of this.raiders) {
                const altRaiders = [];
                for (let alt of raider.alts) {
                    altRaiders.push(raiderToIdMap.get(alt))
                    raiderToIdMap.delete(alt)
                }
                raider.alts = altRaiders;
            }
            this.raiders = Array.from(raiderToIdMap.values());
        },
        async initialize() {
            Utils.initializeBackend();
        },
        async createRaider(name: string) {
            this.raiders.push(await RaidersApi.createRaider(name));
        }
    },
    async mounted() {
        const events = await ExperienceEventsApi.getExperienceEvents();
        this.$store.commit('setExperienceEvents', events);
        this.$store.commit('setExperienceEventIcons');

        const levels = await ExperienceLevelsApi.getExperienceLevels();
        this.$store.commit('setExperienceLevels', levels);

        await this.getRaiders();
        this.raiders.sort((lhs: Raider, rhs: Raider) => { return lhs.experience > rhs.experience ? -1 : 1});
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