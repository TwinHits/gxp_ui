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
            return this.raider?.name;
        },
    }
});
</script>

<style scoped lang="scss">

</style>