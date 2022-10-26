<template>
    <v-dialog :value="show" :width="width" @keydown.esc="$emit('close')" @click:outside="$emit('close')">
        <v-card>
            <v-card-title>
                <v-row no-gutters>
                    <v-col :cols="11">
                        {{ label }}
                    </v-col>
                    <v-col :cols="1" align="right">
                        <IconButton icon="mdi-close" @click="$emit('close')" tooltip="Close" />
                    </v-col>
                </v-row>
            </v-card-title>
            <slot />
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

import IconButton from '@/views/common/IconButton.vue';

export default Vue.extend({
    components: {
        IconButton,
    },
    props: {
        label: {
            type: String,
            required: false,
            default: '',
        },
        show: {
            type: Boolean,
            required: true,
            default: false,
        },
        width: {
            type: String,
            required: false,
            default: '66%',
        },
    },
});
</script>

<style scoped lang="scss"></style>
