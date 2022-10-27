import { Alias } from '@/common/types/alias';
import { Rename } from '@/common/types/rename';
import { ExperienceLevel } from '@/common/types/experienceLevel';

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
    renames: Rename[];
    main: string | undefined;
    active: boolean;
    experienceLevel: ExperienceLevel;
}
