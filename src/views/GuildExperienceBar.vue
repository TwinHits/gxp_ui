<template>
  <v-progress-linear
      :value="percent"
      rounded
      striped
      prominent
      color="blue"
      height="20"
      buffer-value="100"
      @click="$emit('click')"
    >
    {{ experience }} / {{ nextLevel.experience_required }}
    </v-progress-linear>
</template>

<script lang="ts">
import { ExperienceLevel } from '@/common/types/experienceLevel';
import Vue from 'vue';

export default Vue.extend({
    props: {
        experience: {
            type: Number,
            required: true,
        },
    },
    computed: {
        nextLevel(): ExperienceLevel {
            return this.$store.getters.nextExperienceLevel(this.experience)
        },
        percent(): number {
            return this.experience / this.nextLevel.experience_required * 100;
        }
    }
});
</script>

<style scoped lang="scss">

</style>