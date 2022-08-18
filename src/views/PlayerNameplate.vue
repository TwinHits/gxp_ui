<template>
    <v-card class="player-nameplate-card" elevation="10" outlined>
        <v-card-title>
            <v-row no-gutters>
                <v-col :cols="11">
                    {{ raider.name }}
                </v-col>
                <v-col :cols="1">
                    <IconButton icon="mdi-dots-vertical" @click="showOptions = true" />
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            <v-row>
                <v-col cols="4">{{ level.name }}</v-col>
                <v-col cols="4">Joined: {{ joinDate }}</v-col>
                <v-col cols="2">Weeks: {{ raider.totalWeeks }}</v-col>
                <v-col cols="2">Raids: {{ raider.totalRaids }}</v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-text>
            <GuildExperienceBar v-show="!showOptions" :experience="raider.experience" @click="showHistory = true" />
            <v-list dense disabled v-show="!showOptions">
                <AltListItem v-for="alt in raider.alts" :key="alt.id" :alt="alt" @showHistory="showHistory = true" />
            </v-list>
        </v-card-text>
        <v-expand-transition>
            <v-card v-if="showOptions" class="transition-fast-in-fast-out player-nameplate-options-card">
                <v-card-title>
                    <v-row no-gutters>
                        <v-col :cols="11">
                            <v-card-actions class="pt-4">
                                <v-btn @click="emitRaiderToAddAlt(raider)" outlined color="black">Alts</v-btn>
                                <v-btn @click="showAliases = true" outlined color="black">A.K.A</v-btn>
                                <v-switch v-model="isActive" label="Active" color="black"></v-switch>
                            </v-card-actions>
                        </v-col>
                        <v-col :cols="1">
                            <IconButton icon="mdi-close" @click="showOptions = false" />
                        </v-col>
                    </v-row>
                </v-card-title>
            </v-card>
        </v-expand-transition>
        <ExperienceGainHistory v-if="showHistory" :show="showHistory" :raider="raider" @close="showHistory = false" />
        <AddAliasModal v-if="showAliases" :show="showAliases" :raider="raider" @close="showAliases = false" />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import AddAliasModal from '@/views/AddAliasModal.vue';
import AltListItem from '@/views/AltListItem.vue';
import IconButton from '@/views/common/IconButton.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

import { ExperienceLevel } from '@/common/types/experienceLevel';
import { Raider } from '@/common/types/raider';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    components: {
        AddAliasModal,
        AltListItem,
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
            showOptions: false as boolean,
            showHistory: false as boolean,
            showAliases: false as boolean,
            altId: '' as string,
            isActive: true as boolean,
        };
    },
    computed: {
        level(): ExperienceLevel {
            return this.$store.getters.experienceLevel(this.raider.experience);
        },
        joinDate(): string {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(this.raider.join_timestamp));
        },
    },
    methods: {
        emitRaiderToAddAlt(raider: Raider) {
            this.$emit('raiderToAltAdd', raider);
        },
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
