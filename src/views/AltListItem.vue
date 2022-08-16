<template>
    <v-list-item>
        <v-list-item-content>
            <v-list-item-title>{{ alt.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
            <v-btn @click.stop="$emit('delete', alt)">Remove Alt</v-btn>
        </v-list-item-icon>
    </v-list-item>
</template>

<script lang="ts">
import { Alt } from '@/common/types/alt';
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        alt: {
            required: true,
            type: Object as PropType<Alt>,
        },
    },
});
</script>

<style scoped></style>
