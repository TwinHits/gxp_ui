<template>
    <v-card class="player-nameplate-card" elevation="10">
        <v-card-title>
            {{ name }}
        </v-card-title>
        <v-card-text v-if="raider">
            <GuildExperienceBar :experience="59" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Raider } from '@/common/types/raider';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

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
        name(): string {
            return this.raider.name;
        },
    },
});
</script>

<style scoped lang="scss">

</style>