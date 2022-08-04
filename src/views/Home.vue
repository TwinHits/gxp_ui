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

import * as RaidersApi from '@/api/raiders.api';
import * as AltsApi from '@/api/alts.api';
import * as RaidsApi from '@/api/raids.api';

import { Alt } from '@/common/types/alt';
import { Raid } from '@/common/types/raid';
import { Raider } from '@/common/types/raider';

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
        }
    },
    async mounted() {
        this.raiders = await RaidersApi.getRaiders();
        this.alts = await AltsApi.getAlts();
        this.raids = await RaidsApi.getRaids();
        this.$store.commit("setError", new Error("This is a message:)"));
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
