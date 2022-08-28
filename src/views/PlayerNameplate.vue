<template>
    <v-card class="player-nameplate-card" elevation="10" outlined>
        <v-card-title>
            <v-row no-gutters>
                <v-col :cols="11">
                    <v-row v-if="!showRenameRaiderTextField">
                        <v-col :cols="5">
                            {{ raider.name }}
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col :cols="5">
                            <v-text-field v-model="rename" hide-details dense outlined :label="raider.name"></v-text-field>
                        </v-col>
                        <v-col md="auto">
                            <IconButton icon="mdi-content-save-outline" @click="renameRaider(raider, rename)" />
                        </v-col>
                        <v-col md="auto">
                            <IconButton icon="mdi-close" @click="showRenameRaiderTextField = false" />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col :cols="1">
                    <v-menu v-if="isLoggedIn" offset-y transition="slide-y-transition" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <IconButton icon="mdi-dots-vertical" :bind="attrs" :on="on" />
                        </template>
                        <v-list>
                            <v-list-item link @click="recalculateExperience(raider)">
                                <v-list-item-title>Recalculate Experience</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="emitRaiderToAddAlt(raider)">
                                <v-list-item-title>Alts</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="emitRaiderToAddAlias(raider)">
                                <v-list-item-title>A.K.A.</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="setActive(raider, !raider.active)">
                                <v-list-item-title>{{ activeLabel }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="showRenameRaiderTextField = true">
                                <v-list-item-title>Rename</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            <v-row align="center">
                <v-col cols="11" align="left">
                    <GuildExperienceBar :experience="raider.experience" @click="showHistory = true" />
                </v-col>
                <v-col cols="1" align="center">
                    <IconButton v-if="isLoggedIn" icon="mdi-plus-circle-outline" @click="emitShowAddExperienceModal(raider)" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4">{{ raider.experienceLevel.name }}</v-col>
                <v-col cols="4">Joined: {{ joinDate }}</v-col>
                <v-col cols="2">Weeks: {{ raider.totalWeeks }}</v-col>
                <v-col cols="2">Raids: {{ raider.totalRaids }}</v-col>
            </v-row>
        </v-card-subtitle>
        <ExperienceGainHistory v-if="showHistory" :show="showHistory" :raider="raider" @close="showHistory = false" />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

import { Raider } from '@/common/types/raider';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    components: {
        ExperienceGainHistory,
        IconButton,
        GuildExperienceBar,
    },
    props: {
        raider: {
            type: Object as PropType<Raider>,
            required: true,
        },
    },
    data() {
        return {
            showHistory: false as boolean,
            rename: '' as string,
            showRenameRaiderTextField: false,
        };
    },
    computed: {
        joinDate(): string {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(this.raider.join_timestamp));
        },
        activeLabel(): string {
            if (this.raider.active) {
                return 'Set Inactive';
            } else {
                return 'Set Active';
            }
        },
    },
    methods: {
        recalculateExperience(raider: Raider) {
            this.$emit('recalculateExperienceForRaider', raider);
        },
        setActive(raider: Raider, active: boolean) {
            raider.active = active;
            this.$emit('updateRaider', raider);
        },
        renameRaider(raider: Raider, rename: string) {
            raider.name = rename;
            this.$emit('updateRaider', raider);
        },
        emitRaiderToAddAlt(raider: Raider) {
            this.$emit('raiderToAltAdd', raider);
        },
        emitShowAddExperienceModal(raider: Raider) {
            this.$emit('showAddExperienceModal', raider);
        },
        emitRaiderToAddAlias(raider: Raider) {
            this.$emit('showAliasAdd', raider);
        },
        isLoggedIn(): boolean {
            return this.$store.getters.isLoggedIn;
        }
    },
});
</script>

<style scoped lang="scss">
.player-nameplate-options-card {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
