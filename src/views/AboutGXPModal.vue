<template>
    <ModalDialog label="About Guild eXPerience" :show="show" :width="'66%'" @close="$emit('close')">
        <v-card-text class="about-gxp-text">
            GXP is fundamentally MS > OS + 2 with some priority for long time members on certain times.<br />
            Members gain GXP during raids, and each lockout rank will be calculated based on the member’s GXP.<br />
            Higher ranks get priority on rolling for some gear for Main spec.
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';

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
});
</script>

<style scoped lang="scss">
.about-gxp-text {
    font-size: 1.2em;
}
</style>
