import { Alias } from '@/common/types/alias';

export interface Raider {
    id: string;
    name: string;
    experience: number;
    totalRaids: number;
    join_timestamp: number;
    alts: Raider[];
    aliases: Alias[];
}
