<template>
    <ModalDialog :label="label" :show="show" :width="'60%'" @close="$emit('close')">
        <v-card-text>
            <v-row justify="center" v-if="loading">
                <v-col md="auto">
                    <LoadingCircle size="75" class="loading-circle" />
                </v-col>
            </v-row>
            <div v-else>
                <v-card-subtitle class="experience-multipler">
                    Experience Multipler: {{ experienceMultipler }}
                </v-card-subtitle>
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
                        :style="{ 'align-items': 'center', 'padding': '0', 'margin': '0' }"
                        class="experience-history-timeline-item"
                        v-for="gain in gains"
                        :key="gain.id"
                        :icon="getIconForExperienceEvent(gain.experienceEvent)"
                        :color="'black'"
                        fill-dot
                    >
                        <v-row align="center">
                            <v-col cols="11">
                                <HistoryItem :experienceGain="gain" :multipler="raider.experienceMultipler" />
                            </v-col>
                            <v-col cols="1" align="right">
                                <IconButton icon="mdi-trash-can-outline" @click="deleteExperienceGain(gain)" />
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                </v-timeline>
            </div>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';
import HistoryItem from '@/views/HistoryItem.vue';
import LoadingCircle from '@/views/common/LoadingCircle.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { ExperienceGain } from '@/common/types/experienceGain';
import { Raider } from '@/common/types/raider';

import * as ExperienceGainsApi from '@/api/experienceGains.api';
import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    components: {
        IconButton,
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
        };
    },
    computed: {
        experienceMultipler(): string {
            return this.raider.experienceMultipler.toFixed(2);
        },
        experienceGainsByDay(): Record<string, ExperienceGain[]> {
            const experienceGainsByDay = {} as Record<string, ExperienceGain[]>,;
            for (const experienceGain of this.experienceGains) {
                const date = DateTimeUtils.getDateFromUnixTime(experienceGain.timestamp);
                const day = DateTimeUtils.formatDateForDisplay(date);
                if (!experienceGainsByDay[day]) {
                    experienceGainsByDay[day] = [];
                }
                experienceGainsByDay[day].push(experienceGain);
            }
            return experienceGainsByDay;
        },
        label(): string {
            return `${this.raider.name} Experience History`;
        }
    },
    methods: {
        getIconForExperienceEvent(experienceEvent: string) {
            return this.$store.getters.experienceEventIcon(experienceEvent);
        },
        deleteExperienceGain(experienceGain: ExperienceGain) {
            ExperienceGainsApi.deleteExperienceGain(experienceGain.id);
            this.experienceGains.splice(this.experienceGains.findIndex((g: ExperienceGain) => g.id === experienceGain.id), 1);
        },
    },
    async mounted() {
        this.loading = true;
        this.experienceGains = await ExperienceGainsApi.getExperienceGainsForRaiderId(this.raider.id);
        this.experienceGains = this.experienceGains.reverse()
        this.loading = false;
    },
});
</script>

<style scoped lang="scss">
.loading-circle {
    margin-top: 10vh;
    margin-bottom: 10vh;
}

.experience-multipler {
    font-weight: bold;
}

.experience-history-timeline {
    margin-left: 2vw;
    margin-right: 1vw;
}

.experience-history-timeline-date {
    font-weight: bold;
    font-size: 1.1em;
}

</style>
