<template>
    <v-list-item>
        <v-list-item-content>
            <v-list-item-title>
                <v-row>
                    <v-col cols="2" align="left">
                        {{ alt.name }}
                    </v-col>
                    <v-col>
                        <GuildExperienceBar :experience="alt.experience" @click="emitShowHistory" />
                    </v-col>
                </v-row>
            </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon> </v-list-item-icon>
    </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Raider } from '@/common/types/raider';
import GuildExperienceBar from '@/views/GuildExperienceBar.vue';

export default Vue.extend({
    components: {
        GuildExperienceBar,
    },
    props: {
        alt: {
            required: true,
            type: Object as PropType<Raider>,
        },
    },
    methods: {
        emitShowHistory() {
            this.$emit('showHistory');
        },
    },
});
</script>

<style scoped></style>
