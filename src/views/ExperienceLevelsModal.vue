<template>
    <ModalDialog label="Experience Levels" :show="show" @close="$emit('close')">
        <v-card-text>
            <v-data-table
                :loading="loading"
                :headers="headers"
                :items="experienceLevels"
                :items-per-page="10"
                item-key="key"
                class="elevation-1"
                :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-arrow-left',
                    nextIcon: 'mdi-arrow-right',
                }"
            >
                <template v-slot:item.name="{ item }">
                    <v-text-field v-model="item.name" dense />
                </template>
                <template v-slot:item.experience_required="{ item }">
                    <v-text-field v-model="item.experience_required" dense type="number" />
                </template>
                <template v-slot:item.actions="{ item }">
                    <IconButton icon="mdi-content-save-outline" @click="save(item)" tooltip="Save Experience Level" />
                </template>
            </v-data-table>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { ExperienceLevel } from '@/common/types/experienceLevel';

import * as ExperienceLevelsApi from '@/api/experienceLevels.api';

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
    },
    data() {
        return {
            loading: false as boolean,
            experienceLevels: [] as ExperienceLevel[],
            headers: [
                {
                    text: 'Level',
                    value: 'name',
                },
                {
                    text: 'Experience Required',
                    value: 'experience_required',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false,
                },
            ],
        };
    },
    methods: {
        async save(level: ExperienceLevel) {
            await ExperienceLevelsApi.updateExperienceLevel(level);
            // Refresh experience store
            this.$emit('refreshRaiders');
        },
    },
    async mounted() {
        this.loading = true;
        this.experienceLevels = await ExperienceLevelsApi.getExperienceLevels();
        this.loading = false;
    },
});
</script>

<style scoped lang="scss"></style>
