<template>
    <v-switch v-model="reflectedValue" @change="$emit('change')" :color="color" :append-icon="icon" :disabled="disabled" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        value: {
            type: Boolean,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: false,
        },
        tooltip: {
            type: String,
            required: false,
        },
        color: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            reflectedValue: this.value,
        }
    },
    computed: {
        tooltipDisabled(): boolean {
            return !this.tooltip;
        },
    },
    watch: {
        value(newValue) {
            this.reflectedValue = newValue;
        },
        reflectedValue(newValue) {
            this.$emit("input", newValue);
        }
    }
});
</script>

<style scoped></style>
