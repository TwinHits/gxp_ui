<template>
    <v-row>
        <v-col cols="11">{{ experienceGain.description }}</v-col>
        <v-col class="history-item-value" align="left">{{ value }}</v-col>
    </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { ExperienceGain } from '@/common/types/experienceGain';
import { ExperienceEvent } from '@/common/types/experienceEvent';

export default Vue.extend({
    props: {
        experienceGain: {
            required: true,
            type: Object as PropType<ExperienceGain>,
        },
        multipler: {
            required: true,
            type: Number,
        }
    },
    data() {
        return {};
    },
    computed: {
        experienceEvent(): ExperienceEvent {
            return this.$store.getters.experienceEvent(this.experienceGain.experienceEvent);
        },
        value(): string {
            const value = this.experienceEvent.value * this.multipler;
            return value > 0 ? `+${value.toFixed(2)}` : `${value.toFixed(2)}`;
        },
    },
});
</script>

<style scoped lang="scss">
.history-item-value {
    font-weight: bold;
}
</style>
