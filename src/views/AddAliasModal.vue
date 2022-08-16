<template>
    <ModalDialog label="Create History" :show="show" @close="$emit('close')">
        <v-card-text>
            <v-list dense>
                <AliasListItem
                    v-for="alias in raider.aliases"
                    :key="alias.id"
                    :alias="alias"
                    @deleteAlias="deleteAlias"
                />
            </v-list>
            <v-text-field v-model="name" dense outlined label="Alias" />
            <v-btn @click="createAlias">Add Alias</v-btn>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';
import AliasListItem from '@/views/AliasListItem.vue';

import { Raider } from '@/common/types/raider';

import * as AliasApi from '@/api/aliases.api';
import { Alias } from '@/common/types/alias';

export default Vue.extend({
    components: {
        ModalDialog,
        AliasListItem,
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
            name: '' as string,
        };
    },
    methods: {
        async createAlias() {
            const alias = await AliasApi.createAlias(this.name, this.raider.id);
            this.raider.aliases.push(alias);
        },
        async deleteAlias(alias: Alias) {
            AliasApi.deleteAlias(alias.id);
            this.raider.aliases.splice(
                this.raider.aliases.findIndex((a: Alias) => a.id === alias.id),
                1,
            );
        },
    },
});
</script>

<style scoped lang="scss"></style>
