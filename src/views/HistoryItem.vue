<template>
    <v-row>
        <v-col cols="9">{{ experienceGain.description }}</v-col>
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
    },
    data () {
        return {}
    },
    computed: {
        experienceEvent(): ExperienceEvent {
            return this.$store.getters.experienceEvent(this.experienceGain.experienceEventId);
        },
        value(): string {
            const value = this.experienceEvent.value;   
            return value > 0 ? `+${value}` : `${value}`;
        }
    }
});
</script>

<style scoped lang="scss">
.history-item-value {
    font-weight: bold;
}
</style>