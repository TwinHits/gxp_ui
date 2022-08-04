<template>
  <v-progress-linear
      v-model="percent"
      rounded
      striped
      prominent
      color="blue"
      height="20"
      buffer-value="100"
    ></v-progress-linear>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
    props: {
        experience: {
            type: Number,
            required: true,
        },
    },
    computed: {
        percent(): number {
            return this.experience / 100 * 100;
        }
    }
});
</script>

<style scoped lang="scss">

</style>