<template>
     <v-progress-circular
      :size="size"
      :color="color"
      indeterminate
    ></v-progress-circular>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    props: {
        size: {
            required: true,
            type: [Number, String],
            default: 50,
        }
    },
    data() {
        return {
            color: "Red",
        }
    }
});
</script>


<style scoped lang="scss">

</style>