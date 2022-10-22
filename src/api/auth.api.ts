import store from '@/store/index';

import * as Api from '@/api/api';

import config from '@/../config.json';

export async function login(username: string, password: string): Promise<void> {
    const response = await Api.post(`${config.gxpApi.baseUrl}/api/token/`, {
        username,
        password,
    });
    store.commit('setAccessToken', response.access);
    store.commit('setRefreshToken', response.refresh);
}

export async function refreshAccessToken(): Promise<void> {
    const response = await Api.post(`${config.gxpApi.baseUrl}/api/token/refresh/`, {
        refresh: store.getters.refreshToken,
    });
    store.commit('setAccessToken', response.access);
}