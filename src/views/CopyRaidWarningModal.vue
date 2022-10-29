<template>
    <ModalDialog label="Raid Warnings" :show="show" :width="'50%'" @close="$emit('close')">
        <v-card-text class="raid-warnings-text">
            <v-row v-for="raidWarning in raidWarnings" :key="raidWarning" justify="center">
                <v-col :cols="9">
                    {{ raidWarning }}
                </v-col>
            </v-row>
        </v-card-text>
    </ModalDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalDialog from '@/views/common/ModalDialog.vue';

import { Raider } from '@/common/types/raider';

export default Vue.extend({
    components: {
        ModalDialog,
    },
    props: {
        show: {
            required: true,
            type: Boolean,
        },
        raiders: {
            required: true,
            type: Array as PropType<Array<Raider>>,
        },
    },
    data() {
        return {
            raidWarnings: [] as Array<string>,
        };
    },
    watch: {
        raiders(newValue) {
            this.raidWarnings = this.generateRaidWarnings(newValue);
        },
    },
    methods: {
        generateRaidWarnings(raiders: Array<Raider>) {
            const raidersByExperienceLevel = {} as Record<string, Array<string>>;
            for (const raider of raiders) {
                if (raider.experienceLevel.experience_required > 100) {
                    if (!raidersByExperienceLevel[raider.experienceLevel.name]) {
                        raidersByExperienceLevel[raider.experienceLevel.name] = [];
                    }
                    raidersByExperienceLevel[raider.experienceLevel.name].push(raider.name);
                }
            }

            const raidWarnings = [];
            for (const [level, raiders] of Object.entries(raidersByExperienceLevel)) {
                raidWarnings.push('/rw ' + level + ': ' + raiders.join(', '));
            }
            return raidWarnings;
        },
    },
    mounted() {
        this.raidWarnings = this.generateRaidWarnings(this.raiders);
    },
});
</script>

<style scoped lang="scss">
.raid-warnings-text {
    font-size: 1.4em;
}
</style>
