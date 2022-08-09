<template>
    <v-card class="player-nameplate-card" elevation="10">
        <v-card-title>
            {{ raider.name }} {{ raider.experience }} {{ level.name }}
        </v-card-title>
        <v-card-text v-if="raider">
            <GuildExperienceBar :experience="raider.experience" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Raider } from '@/common/types/raider';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';
import { ExperienceLevel } from '@/common/types/experienceLevel';

export default Vue.extend({
    components: { 
        GuildExperienceBar 
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