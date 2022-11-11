<template>
    <v-card class="player-nameplate-card" elevation="6" outlined>
        <v-card-title>
            <v-row no-gutters>
                <v-col :cols="11">
                    <v-row v-if="!showRenameRaiderTextField">
                        <v-col :cols="5" :class="activeClass">
                            {{ raider.name }}
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col :cols="5">
                            <v-text-field v-model="rename" hide-details dense outlined :label="raider.name"></v-text-field>
                        </v-col>
                        <v-col md="auto">
                            <IconButton icon="mdi-content-save-outline" @click="renameRaider(raider, rename)" tooltip="Rename Raider" />
                        </v-col>
                        <v-col md="auto">
                            <IconButton icon="mdi-close" @click="showRenameRaiderTextField = false" tooltip="Close" />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col :cols="1">
                    <v-menu v-if="isLoggedIn" offset-y transition="slide-y-transition" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
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
                            <v-list-item link @click="showJoinDatePicker = true">
                                <v-list-item-title>Set Join Date</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            <v-row align="center">
                <v-col cols="11" align="left">
                    <GuildExperienceBar
                        :experience="raider.experience"
                        :experienceLevel="raider.experienceLevel"
                        @click="showHistory = true"
                    />
                </v-col>
                <v-col cols="1" align="center">
                    <IconButton
                        v-if="isLoggedIn"
                        icon="mdi-plus-circle-outline"
                        @click="emitShowAddExperienceModal(raider)"
                        :disabled="!raider.active"
                        tooltip="Add Experience"
                    />
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
        <DatePickerModal
            :show="showJoinDatePicker"
            label="Select Join Date"
            :timestamp="raider.join_timestamp"
            @change="setJoinTimeStamp(raider, $event)"
            @close="showJoinDatePicker = false"
        />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import DatePickerModal from '@/views/DatePickerModal.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';
import IconButton from '@/views/common/IconButton.vue';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

import { Raider } from '@/common/types/raider';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    components: {
        DatePickerModal,
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
            showJoinDatePicker: false,
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
        isLoggedIn(): boolean {
            return this.$store.getters.isLoggedIn;
        },
        activeClass(): string {
            return this.raider.active ? 'player-nameplate-active' : 'player-nameplate-inactive';
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
        setJoinTimeStamp(raider: Raider, joinTimestampDate: Date) {
            raider.join_timestamp = DateTimeUtils.getUnixTimeFromDate(joinTimestampDate);
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
    },
});
</script>

<style scoped lang="scss">
@import '@/style/Colors.scss';

.player-nameplate-card {
    background-color: $foreground !important;
}

.player-nameplate-options-card {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
    height: 100%;
}

.player-nameplate-subtitle-label {
    font-weight: 600;
}

.player-nameplate-inactive {
    color: rgba(0, 0, 0, 0.6);
}
</style>
