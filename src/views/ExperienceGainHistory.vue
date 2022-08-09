<template>
    <v-row justify="center">
        <v-dialog v-model="show" width="66%">
            <v-card>
                <v-card-title>Experience History</v-card-title>
                <v-card-text>
                    <HistoryItem v-for="gain of experienceGains" :key="gain.id" :experienceGain="gain" />
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="$emit('close')">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import HistoryItem from '@/views/HistoryItem.vue';

import { ExperienceGain } from '@/common/types/experienceGain';
import { Raider } from '@/common/types/raider';

import * as ExperienceGainsApi from '@/api/experienceGains.api';

export default Vue.extend({
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
    components: {
        HistoryItem,
    },
    data () {
        return {
            experienceGains: [] as ExperienceGain[],
        }
    },
    async mounted() {
        this.experienceGains = await ExperienceGainsApi.getExperienceGainsForRaiderId(this.raider.id);
    }
});
</script>

<style scoped lang="scss">

</style>