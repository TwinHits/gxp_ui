<template>
    <v-card class="player-nameplate-card" elevation="10" outlined>
        <v-card-title>
            <v-row no-gutters>
                <v-col :cols="11">
                    {{ raider.name }}
                </v-col>    
                <v-col :cols="1">
                    <v-btn icon @click="showOptions = true"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                </v-col>    
            </v-row>    
        </v-card-title>
        <v-card-subtitle>
            {{ level.name }}
        </v-card-subtitle>
        <v-card-text>
            <GuildExperienceBar v-show="!showOptions" :experience="raider.experience" @click="showHistory = true" />
            <v-list dense disabled>
                <AltListItem v-for="alt in raider.alts" :key="alt.id" :alt="alt" @delete="deleteAlt"/> 
            </v-list>
        </v-card-text>
        <v-expand-transition>
            <v-card v-if="showOptions" class="transition-fast-in-fast-out player-nameplate-options-card">
                <v-card-title>
                    <v-row no-gutters>
                        <v-col :cols="11">
                            <v-card-actions class="pt-4">
                                <v-btn @click='createAlt' outlined color="black">Alts</v-btn>
                                <v-btn @click='showAliases = true' outlined color="black">A.K.A</v-btn>
                                <v-switch v-model="isGuildMember" label="Guild Member" color="black"></v-switch>
                            </v-card-actions>
                        </v-col>    
                        <v-col :cols="1">
                            <v-btn icon @click="showOptions = false"><v-icon>mdi-close</v-icon></v-btn>
                        </v-col>    
                    </v-row>    
                </v-card-title>
            </v-card>
        </v-expand-transition>
        <ExperienceGainHistory v-if="showHistory" :show="showHistory" :raider="raider" @close="showHistory = false" />
        <AddAliasModal :show="showAliases" :raider="raider" @close="showAliases = false" />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import AddAliasModal from '@/views/AddAliasModal.vue';
import AltListItem from '@/views/AltListItem.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

import { ExperienceLevel } from '@/common/types/experienceLevel';
import { Raider } from '@/common/types/raider';

import * as AltsApi from '@/api/alts.api';

export default Vue.extend({
    components: { 
        AddAliasModal,
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
            showOptions: false as boolean,
            showHistory: false as boolean,
            showAliases: false as boolean,
            altId: "" as string,
            isGuildMember: true as boolean,
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

.player-nameplate-options-card {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>