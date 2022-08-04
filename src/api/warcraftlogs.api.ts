import * as Queries from '@/common/constants/queries';
import * as Utils from '@/common/utils/utils';

import * as Api from '@/api/api';
import * as RaidersApi from '@/api/raiders.api';
import * as AltsApi from '@/api/alts.api';

export async function getAttendance() {
    const url = '/api/v2/client';
    let body = { 
        "query": Queries.GUILD_ATTENDANCE_QUERY,
        "variables":  { 
            "page": 0
        }
    };

    let raidlogs = [] as any[];
    try {

        let response;
        do {
            body.variables.page = body.variables.page + 1;
            response = await Api.post(url, body);
            raidlogs = raidlogs.concat(response.data.guildData.guild.attendance.data);
        } while (response?.data.guildData.guild.attendance.has_more_pages)

    } catch (error) {
        console.error(error);
        throw error;
    }


   const raids = Utils.getRaidsFromLogs(raidlogs, await RaidersApi.getRaiders(), await AltsApi.getAlts());
   return raids;
},