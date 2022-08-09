<template>
    <v-card class="player-nameplate-card" elevation="10" @click.stop="showHistory = true" >
        <v-card-title>
            <v-row>
                <v-col md=auto>
                    {{ raider.name }}
                </v-col>
                <v-col />
                <v-col md=auto>
                    {{ level.name }}
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text v-if="raider">
            <GuildExperienceBar :experience="raider.experience" />
        </v-card-text>
        <ExperienceGainHistory v-if="showHistory" :show="showHistory" :raider="raider" @close="showHistory = false" />
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import GuildExperienceBar from '@/views/GuildExperienceBar.vue';
import ExperienceGainHistory from '@/views/ExperienceGainHistory.vue';

import { ExperienceLevel } from '@/common/types/experienceLevel';
import { Raider } from '@/common/types/raider';

export default Vue.extend({
    components: { 
        ExperienceGainHistory,
        GuildExperienceBar 
    },
    data() {
        return {
            showHistory: false as boolean,
        }
    },
    props: {
        raider: {
            type: Object as PropType<Raider>,
            required: true,
        },
    },
    computed: {
        experience(): number {
            return this.raider.experience ? this.raider.experience : 0;
        },
        level(): ExperienceLevel {
            return this.$store.getters.experienceLevel(this.experience)
        },
    }
});
</script>

<style scoped lang="scss">

</style>