<template>
    <ModalDialog label="Create History" :show="show" @close="$emit('close')">
        <v-card-text>
            <v-text-field v-model="name" dense outlined label="name" />
            <v-btn @click="$emit('create', name)">Create Raider</v-btn>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';

export default Vue.extend({
    components: {
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
            name: '' as string,
        };
    },
});
</script>

<style scoped lang="scss"></style>
