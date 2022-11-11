<template>
    <v-progress-linear :value="percent" rounded striped prominent :color="color" height="20" buffer-value="100" @click="$emit('click')">
        {{ displayedString }}
    </v-progress-linear>
</template>

<script lang="ts">
import { ExperienceLevel } from '@/common/types/experienceLevel';
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        experience: {
            type: Number,
            required: true,
        },
        experienceLevel: {
            type: Object as PropType<ExperienceLevel>,
            required: true,
        },
    },
    computed: {
        displayedString(): string {
            return `${Math.round(this.experience)} / ${this.nextLevel.experience_required}`;
        },
        nextLevel(): ExperienceLevel {
            return this.$store.getters.nextExperienceLevel(this.experience);
        },
        percent(): number {
            return ((this.experience - this.experienceLevel.experience_required) / (this.nextLevel.experience_required - this.experienceLevel.experience_required) * 100);
        },
        color(): string {
            return this.$store.getters.experienceLevelColor(this.experienceLevel.id);
        },
    },
});
</script>

<style scoped lang="scss"></style>
