<template>
    <ModalDialog :label="label" :show="show" :width="'33%'" @close="$emit('close')">
        <v-card-subtitle>
            <v-date-picker v-model="pickerDate" @change="$emit('change', getTimestampFromDateString(pickerDate))"></v-date-picker>
        </v-card-subtitle>
    </ModalDialog>
</template>

<script lang="ts">
import Vue from 'vue';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

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
        label: {
            required: true,
            type: String,
        },
        timestamp: {
            required: false,
            type: Number,
        }
    },
    data() {
        return {
            pickerDate: "",
        };
    },
    watch: {
        timestamp(newValue) {
            this.pickerDate = this.getDatePickerFriendlyDate(newValue);
        }
    },
    methods: {
        getDatePickerFriendlyDate(timestamp: number): string {
            const date = DateTimeUtils.getDateFromUnixTime(timestamp);
            return date.toISOString().substr(0, 10);
        },
        getTimestampFromDateString(dateString: string): number {
            return DateTimeUtils.getUnixTimeFromDate(new Date(dateString));
        }
    },
    mounted() {
        this.pickerDate = this.getDatePickerFriendlyDate(this.timestamp);
    }
});
</script>

<style scoped lang="scss">
</style>
