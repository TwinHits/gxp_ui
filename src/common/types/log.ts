import { Raid } from '@/common/types/raid';
import { Raider } from '@/common/types/raider';

export interface Log {
    logsCode: string;
    timestamp: number;
    raidHelperEventId: number;
    zone: string;
    active: boolean;
    raid?: Raid;
    loading?: boolean;
    optional: boolean;
    reserve_raiders: string[];
}
