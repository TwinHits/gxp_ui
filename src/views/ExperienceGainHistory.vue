<template>
    <ModalDialog label="Experience History" :show="show" @close="$emit('close')">
        <v-card-text>
            <LoadingCircle v-if="loading" size="50" />
            <div v-else>
                <v-row>
                    <v-col> Experience Multipler: {{ experienceMultipler }} </v-col>
                </v-row>
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
                        :icon="getIconForExperienceEvent(gain.experienceEvent)"
                        :color="'black'"
                        fill-dot
                    >
                        <v-row align="center">
                            <v-col cols="11">
                                <HistoryItem :experienceGain="gain" :multipler="raider.experienceMultipler" />
                            </v-col>
                            <v-col cols="1">
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
            experienceGainsByDay: {} as Record<string, ExperienceGain[]>,
        };
    },
    computed: {
        experienceMultipler(): string {
            return this.raider.experienceMultipler.toFixed(2);
        },
    },
    methods: {
        getIconForExperienceEvent(experienceEvent: string) {
            return this.$store.getters.experienceEventIcon(experienceEvent);
        },
        deleteExperienceGain(experienceGain: ExperienceGain) {
            ExperienceGainsApi.deleteExperienceGain(experienceGain.id);
            this.$emit("refreshRaiders")
        }
    },
    async mounted() {
        this.loading = true;
        this.experienceGains = await ExperienceGainsApi.getExperienceGainsForRaiderId(this.raider.id);
        this.experienceGains = this.experienceGains.reverse()
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
