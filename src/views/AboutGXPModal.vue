<template>
    <ModalDialog label="About Guild eXPerience" :show="show" :width="'66%'" @close="$emit('close')">
        <v-card-text class="about-gxp-text">
            Guild eXPerience is our custom loot system. It's effectively MS > OS with priority loot rolls for weapons, trinkets, and tier
            pieces for qualifying members.
            <br /><br />
            Members get GXP for signing up for raids, killing bosses, completing raids, coming prepared, and playing well. When you get
            enough GXP, you climb ranks to get priority rolls on weapons, trinkets, or tier.
            <br /><br />
            GXP is calculated between Thursday and Tuesday, and rank changes will happen on Tuesday before raid.
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
