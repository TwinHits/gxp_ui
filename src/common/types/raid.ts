import { Log } from '@/common/types/log';

export interface Raid {
    id: string;
    log: Log;
    zone: string;
    timestamp: number;
    optional: boolean;
    raiders: string[];
}
