<template>
    <v-tooltip bottom :disabled="tooltipDisabled">
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon @click="$emit('click')" :disabled="disabled" v-bind="attrs" v-on="on">
                <v-icon :size="size">{{ icon }}</v-icon>
            </v-btn>
        </template>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
        tooltip: {
            type: String,
            required: false,
            default: '',
        },
        size: {
            type: Number,
            required: false,
            default: 25,
        },
    },
    computed: {
        tooltipDisabled(): boolean {
            return !this.tooltip;
        },
    },
});
</script>

<style scoped></style>
