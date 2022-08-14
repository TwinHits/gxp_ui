<template>
  <v-dialog :value="show" width="66%" @keydown.esc="$emit('close')" @click:outside="$emit('close')">
        <v-card>
            <v-card-title>
                <v-row no-gutters>
                    <v-col :cols="11">
                        {{ label }}
                    </v-col>
                    <v-col :cols="1" align="right">
                         <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>                
            </v-card-title>
            <slot />
        </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        label: {
            type: String,
            required: false,
            default: "",
        },
        show: {
            type: Boolean,
            required: true,
            default: false,
        }
    }  
});
</script>

<style scoped lang="scss">

</style>