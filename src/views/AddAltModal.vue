<template>
    <ModalDialog :label="label" :show="show" :width="'33%'" @close="$emit('close')">
        <v-card-text>
            <v-list class="alt-list" dense>
                <v-list-item v-for="alt in alts" :key="alt.id">
                    <v-list-item-content>
                        <v-list-item-title>{{ alt.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                        <IconButton icon="mdi-trash-can-outline" @click="deleteAlt(alt)" tooltip="Delete Alt" />
                    </v-list-item-icon>
                    <v-list-item-icon>
                        <IconButton icon="mdi-account-arrow-up-outline" @click="makeMain(alt)" tooltip="Make Main" />
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
            <v-row class="alt-list-actions">
                <v-col :cols="10">
                    <v-autocomplete
                        v-model="alt"
                        :items="filteredRaiders"
                        item-text="name"
                        return-object
                        label="Find Alt"
                        clearable
                        dense
                    ></v-autocomplete>
                </v-col>
                <v-col :cols="2" align="center">
                    <v-btn @click="createAlt">Add Alt</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { Raider } from '@/common/types/raider';

import * as RaidersApi from '@/api/raiders.api';

export default Vue.extend({
    components: {
        IconButton,
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
            alt: undefined as Raider | undefined,
        };
    },
    computed: {
        alts(): Raider[] {
            return this.$store.getters.raidersForIds(this.raider.alts);
        },
        label(): string {
            return `Add Alt to ${this.raider.name}`;
        },
        filteredRaiders(): Raider[] {
            const raiderAndAlts = this.raider.alts.concat([this.raider]);
            return this.$store.getters.raiders.filter((r: Raider) => !raiderAndAlts.includes(r) && !r.main);
        },
    },
    methods: {
        getRaiderById(id: string) {
            return this.$store.getters.raider(id);
        },
        async createAlt() {
            if (this.alt) {
                this.alt.main = this.raider.id;
                await RaidersApi.updateRaider(this.alt);
                this.raider.alts.push(this.alt as any);
                this.alt = undefined;
            }
        },
        async deleteAlt(alt: Raider) {
            alt.main = undefined;
            await RaidersApi.updateRaider(alt);
            this.raider.alts.splice(this.raider.alts.findIndex((a: any) => a.id === alt.id, 1));
        },
        async makeMain(alt: Raider) {
            alt.main = this.raider.id;
            await RaidersApi.updateRaider(alt);
        },
    },
});
</script>

<style scoped lang="scss">
@import '@/style/Colors.scss';

.alt-list {
    margin: 0vh 1vw;
    background-color: $foreground !important;
}

.alt-list-actions {
    margin: 0vh 1vw;
}
</style>
