<template>
    <v-card class="player-nameplate-card" elevation="10" @click.stop="showHistory = true" >
        <v-card-title>
            {{ raider.name }}
        </v-card-title>
        <v-card-subtitle>
            {{ level.name }}
        </v-card-subtitle>
        <v-card-text v-if="raider">
            <GuildExperienceBar :experience="raider.experience" />
            <v-list dense disabled>
                <AltListItem v-for="alt in raider.alts" :key="alt.id" :alt="alt" @delete="deleteAlt"/> 
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-text-field v-model="altId" outlined dense label="Alt"></v-text-field>
                </v-col>
                <v-col>
                    <v-btn @click.stop='createAlt'>Add Alt</v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
        <ExperienceGainHistory v-if="showHistory" :show="showHistory" :raider="raider" @close="showHistory = false" />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import AltListItem from '@/views/AltListItem.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

import { ExperienceLevel } from '@/common/types/experienceLevel';
import { Raider } from '@/common/types/raider';

import * as AltsApi from '@/api/alts.api';

export default Vue.extend({
    components: { 
        AltListItem,
        ExperienceGainHistory,
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
            altId: "" as string,
        }
    },
    computed: {
        level(): ExperienceLevel {
            return this.$store.getters.experienceLevel(this.raider.experience);
        },
    },
    methods: {
        async createAlt() {
            await AltsApi.createAlt(this.altId, this.raider.id);
            this.$emit("refreshRaiders")
        },
        async deleteAlt(altId: string) {
            await AltsApi.deleteAlt(altId);
            this.$emit("refreshRaiders")
        },
    }
});
</script>

<style scoped lang="scss">

</style>