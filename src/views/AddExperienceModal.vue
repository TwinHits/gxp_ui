<template>
    <ModalDialog :label="label" :show="show" @close="$emit('close')">
        <v-card-text>
            <v-row>
                <v-col cols="10">
            <v-autocomplete
                v-model="experienceEvent"
                :items="experienceEvents"
                item-text="description"
                return-object
                label="Find Experience Event"
                clearable
                dense
            ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <v-btn :disabled="!experienceEvent" @click="createExperience">Add Experience</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';

import { Raider } from '@/common/types/raider';
import { ExperienceEvent } from '@/common/types/experienceEvent';
import { ExperienceGain } from '@/common/types/experienceGain';

import * as ExperienceGainsApi from '@/api/experienceGains.api';

export default Vue.extend({
    components: {
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
            experienceEvent: undefined as ExperienceEvent | undefined,
        };
    },
    computed: {
        label(): string {
            return `Add Experience to ${this.raider.name}`;
        },
        experienceEvents(): ExperienceEvent[] {
            return this.$store.getters.experienceEvents;
        }
    },
    methods: {
        createExperience() {
            if (this.experienceEvent) {
                ExperienceGainsApi.createExperienceGain({
                    raider: this.raider.id,
                    experienceEvent: this.experienceEvent.id,
                } as ExperienceGain)
                this.$emit('close');
            }
        }
    },
});
</script>

<style scoped lang="scss"></style>Event
