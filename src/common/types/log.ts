import { Raid } from "@/common/types/raid"

export interface Log {
    logsCode: string,
    timestamp: number,
    raidHelperEventId: number,
    zone: string,
    raid?: Raid,
    loading?: Boolean
}