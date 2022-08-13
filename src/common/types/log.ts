import { Raid } from "@/common/types/raid"

export interface Log {
    code: string,
    startTime: number,
    zone: {
        name: string
    },
    raid?: Raid,
    loading?: Booleanm
}