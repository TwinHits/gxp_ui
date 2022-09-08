<template>
    <ModalDialog label="Admin Login" :show="show" :width="'33%'" @close="$emit('close')">
        <v-card-text>
            <v-text-field v-model="username" dense outlined label="Username" />
            <v-text-field v-model="password" dense outlined label="Password" />
        </v-card-text>
        <v-card-actions>
            <v-btn @click="login">Log In</v-btn>
        </v-card-actions>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';

import * as AuthApi from '@/api/auth.api';

export default Vue.extend({
    components: {
        ModalDialog,
    },
    props: {
        show: {
            required: true,
            type: Boolean,
        },
    },
    data() {
        return {
            username: undefined as string | undefined,
            password: undefined as string | undefined,
        };
    },
    methods: {
        login() {
            if (this.username && this.password) {
                const response = AuthApi.login(this.username, this.password);
                this.$emit('close');
            }
        },
    },
});
</script>

<style scoped lang="scss"></style>
