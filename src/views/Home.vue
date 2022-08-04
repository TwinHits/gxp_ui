<template>
    <div class="containing-div">
        <v-row>
            <v-col>
                <v-btn @click="testSomething">Test Something</v-btn>
            </v-col>
        </v-row>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col class="player-nameplate-col" v-for="(n, columnIndex) in numberOfColumns" :key="rowIndex * numberOfColumns + columnIndex">
                <PlayerNameplate :raider="raiders[rowIndex * numberOfColumns + columnIndex]"/>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

import PlayerNameplate from '@/views/PlayerNameplate.vue';

import { Alt } from '@/common/types/alt';
import { ExperienceEvent } from '@/common/types/experienceEvent';
import { ExperienceGain } from '@/common/types/experienceGain';
import { Raid } from '@/common/types/raid';
import { Raider } from '@/common/types/raider';

import * as AltsApi from '@/api/alts.api';
import * as ExperienceEventsApi from '@/api/experienceEvents.api';
import * as ExperienceGainsApi from '@/api/experienceGains.api';
import * as RaidersApi from '@/api/raiders.api';
import * as RaidsApi from '@/api/raids.api';

import * as Utils from '@/common/utils/utils';
import * as ExperienceGainsUtils from '@/common/utils/experienceGains';

export default Vue.extend({
    components: { 
        PlayerNameplate 
    },
    data() {
        return {
            columns: 3,
            error: undefined,
            raiders: [] as Raider[],
            raids: [] as Raid[],
            alts: [] as Alt[],
            events: [] as ExperienceEvent[],
            gains: [] as ExperienceGain[],
        };
    },
    computed: {
        numberOfRows(): number {
            return this.raiders.length / this.columns ? Math.ceil(this.raiders.length / this.columns) : 0; // Don't divide by zero
        },
        numberOfColumns(): number {
            return this.raiders.length / this.numberOfRows ? Math.ceil(this.raiders.length / this.numberOfRows) : 0; // Don't divide by zero
        }
    },
    methods: {
        async testSomething() {
            for (let raider of this.raiders) {
                raider.experience = await ExperienceGainsUtils.calculateExperienceForRaider(raider);
            }
        }
    },
    async mounted() {
        this.raiders = await RaidersApi.getRaiders();
        this.alts = await AltsApi.getAlts();
        this.raids = await RaidsApi.getRaids();
        this.events = await ExperienceEventsApi.getExperienceEvents();
        this.gains = await ExperienceGainsApi.getExperienceGains();
    }
});
</script>

<style scoped lang="scss">
.containing-div {
    width: 100%;
}

.player-nameplate-row {
    width: 100%;
}

.player-nameplate-col {
    width: 20%;
}

</style>
