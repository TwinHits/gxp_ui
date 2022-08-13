<template>
    <v-row>
        <v-col :cols="3">
            {{ date }}
        </v-col>
        <v-col :cols="3">
            {{ log.code}}
        </v-col>
        <v-col :cols="3">
            <v-text-field v-if="!raid || !raid.raidHelperEventId" v-model="raidHelperEventId" outlined dense label="Raid Helper Event Id"></v-text-field>
            <span v-else>{{ raid.raidHelperEventId }}</span>
        </v-col>
        <v-col :cols="1">
            <span v-if="raid">{{ raid.id}}</span>
        </v-col>
        <v-col :cols="1">
            <LoadingCircle v-if="loading" :size="25" />
            <span v-if="raid && !loading">
                <v-btn @click="$emit('delete', raid)">Delete</v-btn>
            </span>
            <span v-if="!raid && !loading">
                <v-btn @click="$emit('create', {code: log.code, raidHelperEventId})">Upload</v-btn>
            </span>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { Log } from '@/common/types/log';
import { Raid } from '@/common/types/raid';

import * as DateTimeUtils from '@/common/utils/dateTimeUtils';
import LoadingCircle from '@/views/common/LoadingCircle.vue';

export default Vue.extend({
    components: { 
        LoadingCircle 
    },
    props: {
        log: {
            type: Object as PropType<Log>,
            required: true,
        },
    },
    data() {
        return {
            raidHelperEventId: "" as string,
        };
    },
    computed: {
        date(): string {
            return DateTimeUtils.formatDateForDisplay(DateTimeUtils.getDateFromUnixTime(this.raid ? this.raid.timestamp : this.log.startTime));
        },
        raid(): Raid | undefined {
            return this.log.raid;
        },
        loading(): boolean {
            return this.log.loading;
        }
    }
});
</script>

<style lang="scss" scoped>

</style>