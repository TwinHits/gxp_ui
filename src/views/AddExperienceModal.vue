<template>
    <ModalDialog :label="label" :show="show" width="50%" @close="$emit('close')">
        <v-card-text>
            <v-row>
                <v-col cols="9">
                    <v-autocomplete
                        v-model="experienceEvent"
                        :items="experienceEvents"
                        item-text="description"
                        return-object
                        label="Experience Event"
                        clearable
                        dense
                    ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                    <v-text-field v-model="customGainValue" dense type="number" outlined label="Value"/>
                </v-col>
                <v-col cols="1">
                    <IconButton icon="mdi-plus-circle-outline" :disabled="!experienceEvent" @click="createExperience" />
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
import { ExperienceEvent } from '@/common/types/experienceEvent';
import { ExperienceGain } from '@/common/types/experienceGain';

import * as ExperienceGainsApi from '@/api/experienceGains.api';

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
            experienceEvent: undefined as ExperienceEvent | undefined,
            customGainValue: 0 as number,
        };
    },
    watch: {
        experienceEvent(newValue: ExperienceEvent) {
            if (newValue) {
                this.customGainValue = newValue.value;
            } else {
                this.customGainValue = 0;
            }
        }
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
                const experienceGain = {
                    raider: this.raider.id,
                    experienceEvent: this.experienceEvent.id,
                } as ExperienceGain;

                if (this.customGainValue != this.experienceEvent.value) {
                    experienceGain.value = this.customGainValue;
                }

                ExperienceGainsApi.createExperienceGain(experienceGain);
                this.$emit('close');
            }
        }
    },
});
</script>

<style scoped lang="scss"></style>Event
