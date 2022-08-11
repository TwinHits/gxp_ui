<template>
    <v-app app>
        <v-content class="content" app>
            <v-container fluid :fill-height="true" class="container font-family">
                <router-view />
                <ErrorBanner />
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import ErrorBanner from '@/views/common/ErrorBanner.vue';

export default Vue.extend({
    components: {
        ErrorBanner
    },
    methods: {

    },
    computed: {

    },
});
</script>

<style scoped lang="scss">
@import '@/style/Colors.scss';

.font-family {
    font-family: 'Anaheim', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $text-dark !important;
}

.container {
    background-color: $background;
    padding-top: 0;
    padding-bottom: 0;
}

</style>
