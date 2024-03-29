<template>
    <ModalDialog :label="label" :show="show" :width="'60%'" @close="$emit('close')">
        <v-card-text>
            <v-row justify="center" v-if="loading">
                <v-col md="auto">
                    <LoadingCircle size="75" class="loading-circle" />
                </v-col>
            </v-row>
            <div v-else>
                <!-- v-card-subtitle class="experience-multipler"> Experience Multipler: {{ experienceMultiplerLabel }} </v-card-subtitle-->
                <v-timeline
                    class="experience-history-timeline"
                    v-for="(gains, raidId) in experienceGainsByRaidId"
                    :key="raidId"
                    align-top
                    dense
                >
                    <template v-if="!raidsByRaidId[raidId].optional">
                        <v-divider />
                        <v-row>
                            <v-col class="experience-history-timeline-date" align="center">
                                {{ formatTimestamp(raidsByRaidId[raidId].timestamp) }}
                            </v-col>
                            <v-col align="center"> Zone: {{ raidsByRaidId[raidId].log.zone }} </v-col>
                            <!--v-col align="center"> Experience: {{ calculateExperienceSoFar(raidId) }} </v-col-->
                        </v-row>
                        <v-divider />
                        <v-timeline-item
                            :style="{ 'align-items': 'center', 'padding': '0', 'margin': '0' }"
                            class="experience-history-timeline-item"
                            v-for="gain in gains"
                            :key="gain.id"
                            :icon="getIconForExperienceEvent(gain.experienceEvent)"
                            :color="getColorForExperienceEvent(gain.experienceEvent)"
                            fill-dot
                        >
                            <v-row align="center">
                                <v-col cols="11">
                                    <HistoryItem :experienceGain="gain" :multipler="raider.experienceMultipler" />
                                </v-col>
                                <v-col cols="1" align="right">
                                    <IconButton
                                        v-if="isLoggedIn"
                                        icon="mdi-trash-can-outline"
                                        @click="deleteExperienceGain(gain)"
                                        tooltip="Delete Experience"
                                    />
                                </v-col>
                            </v-row>
                        </v-timeline-item>
                    </template>
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
import { Raid } from '@/common/types/raid';

import * as ExperienceGainsApi from '@/api/experienceGains.api';
import * as RaidsApi from '@/api/raids.api';
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
            raidsByRaidId: {} as Record<string, Raid>,
            experienceGainsByRaidId: {} as Record<string, ExperienceGain[]>,
            gainsWithNoRaid: [] as ExperienceGain[],
        };
    },
    computed: {
        experienceMultiplerLabel(): string {
            return this.raider.experienceMultipler.toFixed(2);
        },
        label(): string {
            return `${this.raider.name} Experience History`;
        },
        isLoggedIn(): boolean {
            return this.$store.getters.isLoggedIn;
        },
    },
    methods: {
        formatTimestamp(timestamp: number) {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(timestamp));
        },
        getIconForExperienceEvent(experienceEvent: string) {
            return this.$store.getters.experienceEventIcon(experienceEvent);
        },
        getColorForExperienceEvent(experienceEvent: string) {
            return this.$store.getters.experienceEventColor(experienceEvent);
        },
        calculateExperienceSoFar(raidIdSoFar: string) {
            let experience = 0;
            for (const [raidId, gains] of Object.entries(this.experienceGainsByRaidId).reverse()) {
                if (!this.raidsByRaidId[raidId].optional) {
                    for (const gain of gains) {
                        experience += gain.value;
                    }
                }
                if (raidId === raidIdSoFar) {
                    break;
                }
            }
            return experience;
        },
        deleteExperienceGain(experienceGain: ExperienceGain) {
            ExperienceGainsApi.deleteExperienceGain(experienceGain.id);
            /*
            this.experienceGains.splice(
                this.experienceGains.findIndex((g: ExperienceGain) => g.id === experienceGain.id),
                1,
            );
            */
        },
    },
    async mounted() {
        this.loading = true;

        const raids = await RaidsApi.getRaids();
        raids.map((r: Raid) => {
            this.raidsByRaidId[r.id] = r;
        });

        const experienceGains = await (await ExperienceGainsApi.getExperienceGainsForRaiderId(this.raider.id)).reverse();
        for (const gain of experienceGains) {
            if (gain.raid) {
                if (!this.experienceGainsByRaidId[gain.raid]) {
                    this.experienceGainsByRaidId[gain.raid] = [];
                }
                this.experienceGainsByRaidId[gain.raid].push(gain);
            } else {
                this.gainsWithNoRaid.push(gain);
            }
        }

        let nextGainWithoutRaid = this.gainsWithNoRaid.shift();
        for (let gains of Object.values(this.experienceGainsByRaidId)) {
            const latestRaidGainTimstamp = gains[0].timestamp;
            while (nextGainWithoutRaid && latestRaidGainTimstamp < nextGainWithoutRaid.timestamp) {
                gains.unshift(nextGainWithoutRaid);
                nextGainWithoutRaid = this.gainsWithNoRaid.shift();
            }
            if (!nextGainWithoutRaid) {
                break;
            }
        }

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
    font-size: 1.2em;
}
</style>
