<template>
    <v-list-item> 
        <v-list-item-content>
            <v-list-item-title>{{ alias.name }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
            <v-btn icon @click="$emit('deleteAlias', alias)"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
        </v-list-item-icon>
    </v-list-item>
</template>

<script lang="ts">
import { Alias } from '@/common/types/alias';
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        alias: {
            required: true,  
            type: Object as PropType<Alias>,
        }
    }
});
</script>

<style scoped>

</style>