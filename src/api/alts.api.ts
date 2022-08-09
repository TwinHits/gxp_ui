import * as Api from "@/api/api";

import config from '@/../config.json';

import { Alt } from '@/common/types/alt';

export async function getAlt(id: string): Promise<Alt> {
  return await Api.get(`${config.gxpApi.baseUrl}/alts/${id}`) as Alt;
}


export async function getAlts(): Promise<Alt[]> {
  return await Api.getAllPaginated(`${config.gxpApi.baseUrl}/alts/`) as Alt[];
}