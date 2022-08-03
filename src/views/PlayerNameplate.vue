<template>
<v-card class="player-nameplate-card">
    <v-card-text v-if="raider">
        {{ name }} {{ attendance }}
    </v-card-text>
</v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        raider: undefined 
    },
    data() {
        return {}
    },
    computed: {
        name(): string | undefined {
            return this.raider?.player;
        },
        attendance(): number | undefined {
            return this.raider?.attendance;
        },
    }
});
</script>

<style scoped lang="scss">


</style>