import { Alias } from '@/common/types/alias';

export interface Raider {
    id: string;
    name: string;
    experience: number;
    totalRaids: number;
    joinTimestamp: number;
    alts: Raider[];
    aliases: Alias[];
}
