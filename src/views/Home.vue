<template>
    <div>
        <v-row class="nameplate-row" v-for="(n, rowIndex) in numberOfRows" :key="rowIndex">
            <v-col v-for="(n, columnIndex) in numberOfColumns" :key="rowIndex * numberOfColumns + columnIndex">
                <PlayerNameplate :raider="raiders[rowIndex * numberOfColumns + columnIndex]" />
            </v-col>
        </v-row>
        <v-btn @click="getAttendance">Go</v-btn>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

import PlayerNameplate from '@/views/PlayerNameplate.vue';

import * as Api from '@/api/api';

import * as Queries from '@/common/constants/queries';
import * as Utils from '@/common/utils/utils';

export default Vue.extend({
    components: { 
        PlayerNameplate 
    },
    data() {
        return {
            error: undefined,
            raiders: [],
            raids: [],
        };
    },
    computed: {
        numberOfRows(): number {
            return this.raiders.length / 4 ? Math.ceil(this.raiders.length / 4) : 0; // Don't divide by zero
        },
        numberOfColumns(): number {
            return this.raiders.length / this.numberOfRows ? Math.ceil(this.raiders.length / this.numberOfRows) : 0; // Don't divide by zero
        }
    },
    methods: {
        async getAttendance() {
            const url = '/api/v2/client';
            let body = { 
                "query": Queries.GUILD_ATTENDANCE_QUERY,
                "variables":  { 
                    "page": 0
                }
            };

            try {

                let response;
                do {
                    body.variables.page = body.variables.page + 1;
                    response = await Api.post(url, body);
                    this.raids = this.raids.concat(response.data.guildData.guild.attendance.data);
                } while (response?.data.guildData.guild.attendance.has_more_pages)

            } catch (error) {
                this.error = error;
            }

            const raiders = this.filterRaids();
            this.filterRaiders(raiders);
        },
        filterRaids() {
            this.raids.sort((lhs, rhs) => { return lhs.startTime > rhs.startTime ? -1 : 1;} )
            const raidersMap = {};
            for (let [i, raid] of this.raids.entries()) {

                raid.date = new Date(raid.startTime) as Date;
                let dayOfWeek = raid.date.getDay();

                if (dayOfWeek == 2 || dayOfWeek == 4) {
                    raid.mainStageRaid = true;
                }

                if (raid.date.getDate() === this.raids[i-1]?.date.getDate()) {
                    continue; 
                }

                if (raid.mainStageRaid) {
                    let playersInRaid = [];
                    for (let player of raid.players) {
                        let name = Utils.altLookUp(player.name)
                        if (!playersInRaid.includes(player)) {
                            playersInRaid.push(name);
                            if (!raidersMap[name]) {
                                raidersMap[name] = 0;
                            }
                            raidersMap[name] = raidersMap[name] + 1;
                        }
                    }
                }

            }
            return raidersMap;
        },
        filterRaiders(raidersMap) {
            const raiders = [];
            for (let [player, attendance] of Object.entries(raidersMap)) {
                if (attendance > 1) {
                    raiders.push({
                        player,
                        attendance
                    });
                }
            }

            raiders.sort((lhs, rhs) => { return lhs.attendance > rhs.attendance ? -1 : 1;});
            this.raiders = raiders;
        },
    },
});
</script>

<style scoped lang="scss">

</style>
