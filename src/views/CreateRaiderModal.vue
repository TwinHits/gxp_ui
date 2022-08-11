<template>
    <v-dialog :value="show" width="66%">
        <v-card>
            <v-card-title>Create Raider</v-card-title>
            <v-card-actions>
                <v-btn @click="$emit('close')">Close</v-btn>
            </v-card-actions>
            <v-card-text>
                <v-text-field v-model="name" dense outlined label="name" />
                <v-btn @click="$emit('create', name)">Create Raider</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        show: {
            required: true,
            type: Boolean
        },
    },
    data () {
        return {
            name: "" as string,
        }
    },
});
</script>

<style scoped lang="scss">

</style>