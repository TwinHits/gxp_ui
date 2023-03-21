<template>
    <div class="containing-div">
        <v-row>
            <v-col>
                <v-toolbar class="admin-toolbar">
                    <v-row align="center" justify="center">
                        <v-col cols="5">
                            <v-text-field v-model="searchTerm" prepend-icon="mdi-magnify" single-line label="Search"></v-text-field>
                        </v-col>
                        <v-col md="auto" class="toggle-switch-col">
                            <ToggleSwitch
                                v-if="isLoggedIn"
                                v-model="includeInactiveRaiders"
                                :color="includeInactiveRaidersColor"
                                :icon="includeInactiveRaidersIcon"
                            />
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
            :raiders="activeRaiderMains"
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
            :raiders="activeRaiderMains"
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
import ToggleSwitch from '@/views/common/ToggleSwitch.vue';

import { Raider } from '@/common/types/raider';

import * as Colors from '@/common/constants/colors';

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
        ToggleSwitch,
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
            raiderToAltAdd: undefined as Raider | undefined,
            raiderToAddExperience: undefined as Raider | undefined,
            raiderToAddAlias: undefined as Raider | undefined,
            recalculating: false as boolean,
            includeInactiveRaiders: false,
        };
    },
    computed: {
        validatedSearchTerm(): string {
            if (this.searchTerm.length >= 2) {
                return this.searchTerm.toLowerCase();
            } else {
                return '';
            }
        },
        raiders(): Raider [] {
            return this.$store.getters.raiders;
        },
        activeRaiders(): Raider [] {
            return this.$store.getters.activeRaiders;
        },
        raiderMains(): Raider [] {
            return this.$store.getters.raiderMains;
        },
        activeRaiderMains(): Raider [] {
            return this.$store.getters.activeRaiderMains;
        },
        filteredRaiders(): Raider[] {
            if (this.validatedSearchTerm) {
                return this.raiders.filter((raider: Raider) => raider.name.toLowerCase().includes(this.validatedSearchTerm));
            } else if (!this.includeInactiveRaiders) {
                return this.activeRaiderMains;
            } else if (this.includeInactiveRaiders) {
                return this.raiderMains;
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
        includeInactiveRaidersColor(): string {
            return this.includeInactiveRaiders ? Colors.GREY : Colors.GREY;
        },
        includeInactiveRaidersIcon(): string {
            return this.includeInactiveRaiders ? 'mdi-ghost-outline' : 'mdi-ghost-off-outline';
        },
    },
    methods: {
        async getRaiders() {
            const raiders = await RaidersApi.getRaiders();
            this.$store.commit('setRaiders', raiders);
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
        this.getRaiders();

        const events = await ExperienceEventsApi.getExperienceEvents();
        this.$store.commit('setExperienceEvents', events);
        this.$store.commit('setExperienceEventIcons');
        this.$store.commit('setExperienceEventColors');

        const levels = await ExperienceLevelsApi.getExperienceLevels();
        this.$store.commit('setExperienceLevels', levels);
        this.$store.commit('setExperienceLevelColors');
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

.toggle-switch-col {
    padding-top: 3vh;
}
</style>
