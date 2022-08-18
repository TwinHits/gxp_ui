<template>
    <ModalDialog label="Create History" :show="show" @close="$emit('close')">
        <v-card-text>
            <v-data-table
                :loading="loading"
                :headers="headers"
                :items="experienceEvents"
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
                <template v-slot:item.description="{ item }">
                    <v-text-field v-model="item.description" dense />
                </template>
                <template v-slot:item.template="{ item }">
                    <v-text-field v-model="item.template" dense />
                </template>
                <template v-slot:item.value="{ item }">
                    <v-text-field v-model="item.value" dense type="number" />
                </template>
                <template v-slot:item.actions="{ item }">
                    <IconButton icon="mdi-content-save-outline" @click="save(item)" />
                </template>
            </v-data-table>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';
import ModalDialog from '@/views/common/ModalDialog.vue';

import { ExperienceEvent } from '@/common/types/experienceEvent';

import * as ExperienceEventsApi from '@/api/experienceEvents.api';

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
            experienceEvents: [] as ExperienceEvent[],
            headers: [
                {
                    text: 'Event',
                    value: 'description',
                },
                {
                    text: 'Template',
                    value: 'template',
                },
                {
                    text: 'Experience Gain',
                    value: 'value',
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
        save(event: ExperienceEvent) {
            ExperienceEventsApi.updateExperienceEvent(event);
            this.$emit('refreshRaiders');
        },
    },
    async mounted() {
        this.loading = true;
        this.experienceEvents = await ExperienceEventsApi.getExperienceEvents();
        this.loading = false;
    },
});
</script>

<style scoped lang="scss"></style>
