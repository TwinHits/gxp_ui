<template>
  <v-card-text>
            <v-list dense>
                <v-list-item v-for="reserve in reserves" :key="reserve.id">
                    <v-list-item-content>
                        <v-list-item-title>{{ reserve.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                        <IconButton icon="mdi-trash-can-outline" @click="removeReserve(reserve)" tooltip="Remove Reserve" />
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
            <v-row>
                <v-col :cols="10">
                    <v-autocomplete
                        v-model="reserve"
                        :items="activeRaiderMains"
                        item-text="name"
                        return-object
                        label="Find Raider"
                        clearable
                        dense
                    ></v-autocomplete>
                </v-col>
                <v-col :cols="2" align="center">
                    <v-btn @click="addReserve" :disabled="isReserveAlreadySelected()">Add Reserve</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col :cols="2" align="center">
                    <v-btn @click="goBack">Back</v-btn>
                </v-col>
                <v-col :cols="2" align="center">
                    <v-btn @click="emitReserves">Continue</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Log } from '@/common/types/log';
import { Raider } from '@/common/types/raider';

import IconButton from '@/views/common/IconButton.vue'

export default Vue.extend({ 
    components: {
        IconButton,
    },
    props: {
        log: {
            required: true,
            type: Object as PropType<Log>,
        }
    },
    data() {
        return {
            reserve: undefined as Raider | undefined,
            reserves: [] as Raider[],
        }
    },
    computed: {
        activeRaiderMains(): Raider[] {
            return this.$store.getters.activeRaiderMains;
        }
    },
    methods: {
        addReserve() {
            if (this.reserve) {
                this.reserves.push(this.reserve);
                this.reserve = undefined;
            }
        },
        removeReserve(reserve: Raider) {
            this.reserves.splice(this.reserves.findIndex((r: Raider) => r.id === reserve.id, 1));
        },
        isReserveAlreadySelected() {
            if (this.reserve) {
                return this.reserves.includes(this.reserve);
            } else {
                return true;
            }
        },
        emitReserves() {
            console.log(this.reserves)
            const reserveIds = this.reserves.map((r: Raider) => r.id);
            console.log(reserveIds)
            this.$emit("addReserves", reserveIds);
        },
        goBack() {
            this.$emit("goBack");
        },
        getRaidersForIds(reserveRaiderIds: string[]) {
            return reserveRaiderIds.map((id: string) => this.$store.getters.raider(id))
        }
    },
    mounted() {
        this.reserves = this.getRaidersForIds(this.log.reserve_raiders);
    },
    watch: {
        log(newValue) {
            this.reserves = this.getRaidersForIds(newValue.reserve_raiders);
        },
    }
})
</script>

<style scoped lang="scss">

</style>