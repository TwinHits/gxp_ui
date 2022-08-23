<template>
    <v-btn icon @click="$emit('click')" v-on="on" v-bind="bind" :disabled="disabled">
        <v-icon>
            {{ icon }}
        </v-icon>
    </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true,
        },
        on: {
            required: false,
        },
        bind: {
            required: false,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
});
</script>

<style scoped></style>
