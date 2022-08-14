import { Alias } from "@/common/types/alias";

export interface Raider {
    id: string,
    name: string,
    experience: number,
    joinTimestamp: number,
    alts: string[],
    aliases: Alias[],
}