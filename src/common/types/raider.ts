import { Alias } from '@/common/types/alias';

export interface Raider {
    id: string;
    name: string;
    experience: number;
    totalRaids: number;
    totalWeeks: number;
    experienceMultipler: number;
    join_timestamp: number;
    alts: Raider[];
    aliases: Alias[];
    main: string | undefined;
    active: boolean;
}
