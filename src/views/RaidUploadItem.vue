<template>
    <v-row>
        <v-col>
            {{ date }}
        </v-col>
        <v-col>
            {{ log.code}}
        </v-col>
        <v-col>
            <span v-if="raid">{{ raid.id}}</span>
        </v-col>
        <v-col>
            <span v-if="!raid">
                <v-btn @click="$emit('create', log.code)">Upload</v-btn>
            </span>
        </v-col>
        <v-col>
            <span v-if="raid">
                <v-btn @click="$emit('delete', raid)">Delete</v-btn>
            </span>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Log } from '@/common/types/log';
import { Raid } from '@/common/types/raid';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';

export default Vue.extend({
    props: {
        raid: {
            type: [Object as PropType<Raid>, undefined],
        },
        log: {
            type: Object as PropType<Log>,
            required: true,
        }
    },
    computed: {
        date(): string {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(this.raid ? this.raid.timestamp : this.log.startTime));
        }
    }
});
</script>

<style lang="scss" scoped>

</style>