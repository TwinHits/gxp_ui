<template>
    <v-dialog :value="show" width="66%" @keydown.esc="$emit('close')" @click:outside="$emit('close')">
        <v-card>
            <v-card-title>Experience History</v-card-title>
            <v-card-actions>
                <v-btn @click="$emit('close')">Close</v-btn>
            </v-card-actions>
            <v-card-text>
                <LoadingCircle v-if="loading" size="50" />
                <HistoryItem v-else v-for="gain of experienceGains" :key="gain.id" :experienceGain="gain" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import HistoryItem from '@/views/HistoryItem.vue';
import LoadingCircle from '@/views/common/LoadingCircle.vue';

import { ExperienceGain } from '@/common/types/experienceGain';
import { Raider } from '@/common/types/raider';

import * as ExperiencsGainsApi from '@/api/experienceGains.api';

export default Vue.extend({
    components: {
        HistoryItem,
        LoadingCircle
    },
    props: {
        show: {
            required: true,
            type: Boolean
        },
        raider: {
            required: true,
            type: Object as PropType<Raider>,
        }
    },
    data () {
        return {
            loading: false,
            experienceGains: [] as ExperienceGain[],
        }
    },
    async mounted() {
        this.loading = true;
        this.experienceGains = await ExperiencsGainsApi.getExperienceGainsForRaiderId(this.raider.id);
        this.loading = false;
    }
});
</script>

<style scoped lang="scss">

</style>