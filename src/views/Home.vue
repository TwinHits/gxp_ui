<template>
    <div class="containing-div">
        <v-row>
            <v-col>
                <v-toolbar class="admin-toolbar">
                    <v-row align="center">
                        <v-col cols="5">
                            <v-text-field v-model="searchTerm" prepend-icon="mdi-magnify" single-line label="Search"></v-text-field>
                        </v-col>
                        <v-col md="auto">
                            <v-switch v-if="isLoggedIn" v-model="includeInactiveRaiders" label="Include Inactive" @change="getRaiders" />
                        </v-col>
                        <v-col>
                            <v-spacer />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn"
                                @click="showRaids = true"
                                icon="mdi-table-plus"
                                tooltip="Upload New Raid"
                                :size="30"
                            />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn"
                                @click="showCreateRaider = true"
                                icon="mdi-account-plus-outline"
                                tooltip="Create New Raider"
                                :size="30"
                            />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn"
                                @click="showExperienceEvents = true"
                                icon="mdi-calendar-edit-outline"
                                tooltip="Edit Experience Events"
                                :size="30"
                            />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn"
                                @click="showExperienceLevels = true"
                                icon="mdi-playlist-edit"
                                tooltip="Edit Experience Levels"
                                :size="30"
                            />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn && !recalculating"
                                @click="recalculateExperience()"
                                icon="mdi-refresh"
                                tooltip="Refresh Experience"
                                :size="30"
                            />
                            <LoadingCircle v-if="isLoggedIn && recalculating" :size="30" />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="isLoggedIn"
                                @click="showRaidWarningModal = true"
                                icon="mdi-bullhorn-variant-outline"
                                tooltip="Show Raid Warnings"
                                :size="30"
                            />
                        </v-col>
                        <v-col md="auto">
                            <IconButton @click="showAboutGXPModal = true" icon="mdi-information-outline" tooltip="About GXP" :size="30" />
                        </v-col>
                        <v-col md="auto">
                            <IconButton @click="goToKofi" icon="mdi-coffee-to-go-outline" tooltip="Power GXP with Coffee" :size="30" />
                        </v-col>
                        <v-col md="auto">
                            <IconButton
                                v-if="!isLoggedIn"
                                @click="showAdminLoginModal = true"
                                icon="mdi-login"
                                tooltip="Admin Login"
                                :size="30"
                            />
                            <IconButton v-if="isLoggedIn" @click="logout" icon="mdi-logout" tooltip="Logout" :size="30" />
                        </v-col>
                    </v-row>
                </v-toolbar>
            </v-col>
        </v-row>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col class="player-nameplate-col" v-for="(n, columnIndex) in numberOfColumns" :key="rowIndex * numberOfColumns + columnIndex">
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
                    @showAliasAdd="
                        raiderToAddAlias = $event;
                        showAddAliasModal = true;
                    "
                    @recalculateExperienceForRaider="recalculateExperience($event)"
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
        <ExperienceEventsModal :show="showExperienceEvents" @close="showExperienceEvents = false" @refreshRaiders="getRaiders" />
        <ExperienceLevelsModal :show="showExperienceLevels" @close="showExperienceLevels = false" @refreshRaiders="getRaiders" />
        <AddExperienceModal
            v-if="raiderToAddExperience"
            :show="showAddExperienceModal"
            :raider="raiderToAddExperience"
            @close="showAddExperienceModal = false"
            @refreshRaiders="getRaiders"
        />
        <AddAliasModal v-if="showAddAliasModal" :show="showAddAliasModal" :raider="raiderToAddAlias" @close="showAddAliasModal = false" />
        <AdminLoginModal v-if="showAdminLoginModal" :show="showAdminLoginModal" @close="showAdminLoginModal = false" />
        <CopyRaidWarningModal
            v-if="showRaidWarningModal"
            :show="showRaidWarningModal"
            @close="showRaidWarningModal = false"
            :raiders="raiders"
        />
        <AboutGXPModal v-if="showAboutGXPModal" :show="showAboutGXPModal" @close="showAboutGXPModal = false" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import AddAltModal from '@/views/AddAltModal.vue';
import AddAliasModal from '@/views/AddAliasModal.vue';
import AddExperienceModal from '@/views/AddExperienceModal.vue';
import AdminLoginModal from '@/views/AdminLoginModal.vue';
import CreateRaiderModal from '@/views/CreateRaiderModal.vue';
import CopyRaidWarningModal from '@/views/CopyRaidWarningModal.vue';
import ExperienceEventsModal from '@/views/ExperienceEventsModal.vue';
import ExperienceLevelsModal from '@/views/ExperienceLevelsModal.vue';
import IconButton from '@/views/common/IconButton.vue';
import AboutGXPModal from '@/views/AboutGXPModal.vue';
import LoadingCircle from '@/views/common/LoadingCircle.vue';
import LogUploads from '@/views/LogUploads.vue';
import PlayerNameplate from '@/views/PlayerNameplate.vue';

import { Raider } from '@/common/types/raider';

import * as RaidersApi from '@/api/raiders.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceLevelsApi from '@/api/experienceLevels.api';

export default Vue.extend({
    components: {
        AddAltModal,
        AddAliasModal,
        AddExperienceModal,
        AdminLoginModal,
        CopyRaidWarningModal,
        CreateRaiderModal,
        ExperienceEventsModal,
        ExperienceLevelsModal,
        IconButton,
        AboutGXPModal,
        PlayerNameplate,
        LogUploads,
        LoadingCircle,
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
            showAddAliasModal: false,
            showAdminLoginModal: false,
            showRaidWarningModal: false,
            showAboutGXPModal: false,
            searchTerm: '' as string,
            raiders: [] as Raider[],
            raiderToAltAdd: undefined as Raider | undefined,
            raiderToAddExperience: undefined as Raider | undefined,
            raiderToAddAlias: undefined as Raider | undefined,
            recalculating: false as boolean,
            includeInactiveRaiders: false,
        };
    },
    computed: {
        filteredRaiders(): Raider[] {
            if (this.searchTerm) {
                return this.raiders.filter((raider: Raider) => raider.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
            } else {
                return this.raiders;
            }
        },
        numberOfRows(): number {
            return this.filteredRaiders.length / this.columns ? Math.ceil(this.filteredRaiders.length / this.columns) : 0; // Don't divide by zero
        },
        numberOfColumns(): number {
            return this.filteredRaiders.length / this.numberOfRows ? Math.ceil(this.filteredRaiders.length / this.numberOfRows) : 0; // Don't divide by zero
        },
        isLoggedIn(): boolean {
            return this.$store.getters.isLoggedIn;
        },
    },
    methods: {
        async getRaiders() {
            if (this.includeInactiveRaiders) {
                this.raiders = await RaidersApi.getRaiders();
            } else {
                this.raiders = await RaidersApi.getRaiders(true);
            }

            // Don't display alts as nameplates
            const idToRaiderMap = new Map() as Map<string, Raider>;
            for (let raider of this.raiders) {
                idToRaiderMap.set(raider.id, raider);
            }

            for (let raider of this.raiders) {
                const alts = [] as Raider[];
                for (let alt of raider.alts) {
                    const raider = idToRaiderMap.get((alt as unknown) as string);
                    if (raider) {
                        alts.push(raider);
                        idToRaiderMap.delete((alt as unknown) as string);
                    }
                }
                raider.alts = alts;
            }
            this.raiders = Array.from(idToRaiderMap.values());

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
        async createRaider(name: string) {
            this.raiders.push(await RaidersApi.createRaider(name));
        },
        async recalculateExperience(raider?: Raider) {
            this.recalculating = true;
            const recalculate_only_active_raiders = !this.includeInactiveRaiders ? true : undefined;
            await RaidersApi.recalculateExperience(raider, recalculate_only_active_raiders);
            await this.getRaiders();
            this.recalculating = false;
        },
        logout() {
            this.$store.commit('logout');
        },
        goToKofi() {
            window.open('https://ko-fi.com/twinhits', '_blank');
        },
    },
    async mounted() {
        const events = await ExperienceEventsApi.getExperienceEvents();
        this.$store.commit('setExperienceEvents', events);
        this.$store.commit('setExperienceEventIcons');
        this.$store.commit('setExperienceEventColors');

        const levels = await ExperienceLevelsApi.getExperienceLevels();
        this.$store.commit('setExperienceLevels', levels);
        this.$store.commit('setExperienceLevelColors');

        await this.getRaiders();
    },
});
</script>

<style scoped lang="scss">
@import '@/style/Colors.scss';

.admin-toolbar {
    background-color: $foreground !important;
}

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
