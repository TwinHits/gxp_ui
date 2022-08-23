<template>
    <v-alert class="error-alert" v-if="error" v-model="show" color="red" dismissible elevation="6" type="error">{{ message }}</v-alert>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            show: false as boolean,
        };
    },
    computed: {
        error(): Error | undefined {
            return this.$store.getters.error;
        },
        message(): string | undefined {
            return this.error?.message;
        },
    },
    watch: {
        '$store.state.Error.error': function (newValue) {
            if (newValue) {
                this.show = true;
            } else {
                this.show = false;
            }
        },
    },
});
</script>

<style scoped lang="scss">
.error-alert {
    position: fixed;
    bottom: 0vh;
    left: 1vw;
}
</style>
