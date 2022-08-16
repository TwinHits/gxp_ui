<template>
    <ModalDialog label="Experience History" :show="show" @close="$emit('close')">
        <v-card-text>
            <LoadingCircle v-if="loading" size="50" />
            <div v-else>
                <v-timeline
                    class="experience-history-timeline"
                    v-for="(gains, date) in experienceGainsByDay"
                    :key="date"
                    align-top
                    dense
                >
                    <v-row>
                        <v-col class="experience-history-timeline-date" align="center">
                            {{ date }}
                        </v-col>
                    </v-row>
                    <v-timeline-item
                        :style="{ 'align-items': 'center' }"
                        class="experience-history-timeline-item"
                        v-for="gain in gains"
                        :key="gain.id"
                        :icon="getIconForExperienceEvent(gain.experienceEventId)"
                        :color="'black'"
                        fill-dot
                    >
                        <HistoryItem :experienceGain="gain" />
                    </v-timeline-item>
                </v-timeline>
            </div>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import HistoryItem from '@/views/HistoryItem.vue';
import LoadingCircle from '@/views/common/LoadingCircle.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { ExperienceGain } from '@/common/types/experienceGain';
import { Raider } from '@/common/types/raider';

import * as ExperiencsGainsApi from '@/api/experienceGains.api';
import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    components: {
        HistoryItem,
        LoadingCircle,
        ModalDialog,
    },
    props: {
        show: {
            required: true,
            type: Boolean,
        },
        raider: {
            required: true,
            type: Object as PropType<Raider>,
        },
    },
    data() {
        return {
            loading: false,
            experienceGains: [] as ExperienceGain[],
            experienceGainsByDay: {} as Record<string, ExperienceGain[]>,
        };
    },
    methods: {
        getIconForExperienceEvent(experienceEventId: string) {
            return this.$store.getters.experienceEventIcon(experienceEventId);
        },
    },
    async mounted() {
        this.loading = true;
        this.experienceGains = await ExperiencsGainsApi.getExperienceGainsForRaiderId(this.raider.id);
        for (const experienceGain of this.experienceGains) {
            const date = DateTimeUtils.getDateFromUnixTime(experienceGain.timestamp);
            const day = date.toLocaleDateString();
            if (!this.experienceGainsByDay[day]) {
                this.experienceGainsByDay[day] = [];
            }
            this.experienceGainsByDay[day].push(experienceGain);
        }
        this.loading = false;
    },
});
</script>

<style scoped lang="scss">
.experience-history-timeline {
    margin-left: 3vw;
}

.experience-history-timeline-date {
    font-weight: bold;
}
</style>
