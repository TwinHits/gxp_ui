<template>
    <div class="containing-div">
        <v-row>
            <v-col>
                <v-toolbar>
                    <v-text-field
                        v-model="searchTerm"
                        prepend-icon="mdi-magnify"
                        single-line
                        label="Search"
                    ></v-text-field>
                </v-toolbar>
            </v-col>
            <v-col cols="2">
                <v-btn @click="showRaids = true">Raids</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="showCreateRaider = true">Create Raider</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="showExperienceEvents = true">Experience Events</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="showExperienceLevels = true">Experience Levels</v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn @click="dev">DEV</v-btn>
            </v-col>
        </v-row>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col
                class="player-nameplate-col"
                v-for="(n, columnIndex) in numberOfColumns"
                :key="rowIndex * numberOfColumns + columnIndex"
            >
                <PlayerNameplate
                    v-if="rowIndex * numberOfColumns + columnIndex < filteredRaiders.length"
                    :raider="filteredRaiders[rowIndex * numberOfColumns + columnIndex]"
                    @refreshRaiders="getRaiders"
                    @raiderToAltAdd="
                        raiderToAltAdd = $event;
                        showAddAlt = true;
                    "
                    @showAddExperienceModal="
                        raiderToAddExperience = $event;
                        showAddExperienceModal = true;
                    "
                    @updateRaider="updateRaider($event)"
                />
            </v-col>
        </v-row>
        <LogUploads :show="showRaids" @close="showRaids = false" @refreshRaiders="getRaiders" />
        <CreateRaiderModal :show="showCreateRaider" @close="showCreateRaider = false" @create="createRaider" />
        <AddAltModal
            v-if="raiderToAltAdd"
            :show="showAddAlt"
            :raider="raiderToAltAdd"
            :raiders="raiders"
            @close="showAddAlt = false"
            @refreshRaiders="getRaiders"
        />
        <ExperienceEventsModal
            :show="showExperienceEvents"
            @close="showExperienceEvents = false"
            @refreshRaiders="getRaiders"
        />
        <ExperienceLevelsModal
            :show="showExperienceLevels"
            @close="showExperienceLevels = false"
            @refreshRaiders="getRaiders"
        />
        <AddExperienceModal
            v-if="raiderToAddExperience"
            :show="showAddExperienceModal"
            :raider="raiderToAddExperience"
            @close="showAddExperienceModal = false"
            @refreshRaiders="getRaiders"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import AddAltModal from '@/views/AddAltModal.vue';
import AddExperienceModal from '@/views/AddExperienceModal.vue';
import CreateRaiderModal from '@/views/CreateRaiderModal.vue';
import ExperienceEventsModal from '@/views/ExperienceEventsModal.vue';
import ExperienceLevelsModal from '@/views/ExperienceLevelsModal.vue';
import LogUploads from '@/views/LogUploads.vue';
import PlayerNameplate from '@/views/PlayerNameplate.vue';

import { Raider } from '@/common/types/raider';

import * as DevUtils from '@/common/utils/devUtils';

import * as RaidersApi from '@/api/raiders.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceLevelsApi from '@/api/experienceLevels.api';

export default Vue.extend({
    components: {
        AddAltModal,
        AddExperienceModal,
        CreateRaiderModal,
        ExperienceEventsModal,
        ExperienceLevelsModal,
        PlayerNameplate,
        LogUploads,
    },
    data() {
        return {
            columns: 3,
            error: undefined,
            showRaids: false,
            showCreateRaider: false,
            showAddAlt: false,
            showExperienceEvents: false,
            showExperienceLevels: false,
            showAddExperienceModal: false,
            searchTerm: '' as string,
            raiders: [] as Raider[],
            raiderToAltAdd: undefined as Raider | undefined,
            raiderToAddExperience: undefined as Raider | undefined,
        };
    },
    computed: {
        filteredRaiders(): Raider[] {
            if (this.searchTerm.toLowerCase()) {
                return this.raiders.filter((raider: Raider) => raider.name.toLowerCase().includes(this.searchTerm));
            } else {
                return this.raiders;
            }
        },
        numberOfRows(): number {
            return this.filteredRaiders.length / this.columns
                ? Math.ceil(this.filteredRaiders.length / this.columns)
                : 0; // Don't divide by zero
        },
        numberOfColumns(): number {
            return this.filteredRaiders.length / this.numberOfRows
                ? Math.ceil(this.filteredRaiders.length / this.numberOfRows)
                : 0; // Don't divide by zero
        },
    },
    methods: {
        async getRaiders() {
            this.raiders = await RaidersApi.getRaiders(true);

            // Don't display alts as nameplates
            const raiderToIdMap = new Map() as Map<string, Raider>;
            for (let raider of this.raiders) {
                raiderToIdMap.set(raider.id, raider);
            }

            for (let raider of this.raiders) {
                const alts = [] as Raider[];
                for (let alt of raider.alts) {
                    alts.push(raiderToIdMap.get(alt));
                    raiderToIdMap.delete(alt);
                }
                raider.alts = alts
            }
            this.raiders = Array.from(raiderToIdMap.values());

            // Sort by experience
            this.raiders.sort((lhs: Raider, rhs: Raider) => {
                return lhs.experience > rhs.experience ? -1 : 1;
            });
        },
        async updateRaider(raider: Raider) {
            const updatedRaider = await RaidersApi.updateRaider(raider);
            const index = this.raiders.findIndex((r: Raider) => r.id === updatedRaider.id);
            this.raiders[index] = updatedRaider;
        },
        async dev() {
            DevUtils.getOrderedCurrentExperienceFromRaiders(this.raiders);
        },
        async createRaider(name: string) {
            this.raiders.push(await RaidersApi.createRaider(name));
        },
    },
    async mounted() {
        const events = await ExperienceEventsApi.getExperienceEvents();
        this.$store.commit('setExperienceEvents', events);
        this.$store.commit('setExperienceEventIcons');

        const levels = await ExperienceLevelsApi.getExperienceLevels();
        this.$store.commit('setExperienceLevels', levels);

        await this.getRaiders();
    },
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
