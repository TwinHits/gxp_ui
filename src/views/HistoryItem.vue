<template>
    <v-row align="center">
        <v-col cols="10" align="left">{{ experienceGain.description }}</v-col>
        <v-col cols="2" class="history-item-value" align="right">{{ value }}</v-col>
    </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { ExperienceGain } from '@/common/types/experienceGain';

export default Vue.extend({
    props: {
        experienceGain: {
            required: true,
            type: Object as PropType<ExperienceGain>,
        },
        multipler: {
            required: true,
            type: Number,
        },
    },
    data() {
        return {};
    },
    computed: {
        value(): string {
            let value = this.experienceGain.value;
            if (!this.experienceGain.experienceEvent || this.experienceGain.experienceEvent?.multiplied) {
                value = this.experienceGain.value * this.multipler;
            }
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
