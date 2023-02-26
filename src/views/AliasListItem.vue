<template>
    <v-list-item>
        <v-list-item-content>
            <v-list-item-title>{{ alias.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
            <IconButton icon="mdi-trash-can-outline" @click="$emit('deleteAlias', alias)" tooltip="Delete Alias" />
        </v-list-item-icon>
    </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import IconButton from '@/views/common/IconButton.vue';

import { Alias } from '@/common/types/alias';

export default Vue.extend({
    components: {
        IconButton,
    },
    props: {
        alias: {
            required: true,
            type: Object as PropType<Alias>,
        },
    },
});
</script>

<style lang="scss" scoped>
@import '@/style/Colors.scss';

.alias-list-item {
    background-color: $foreground;
}
</style>
