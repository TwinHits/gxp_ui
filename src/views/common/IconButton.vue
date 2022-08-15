<template>
    <v-btn icon @click="$emit('click')"> 
        <v-icon>
            {{ icon }}
        </v-icon>
    </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true,
        }
    }    
})
</script>

<style scoped>

</style>