import jwtDecode from 'jwt-decode';

import store from '@/store/index';

import * as Api from '@/api/api';

import config from '@/../config.json';


export async function login(username: string, password: string) {
    const response =  await Api.post(`${config.gxpApi.baseUrl}/api/token/`, {
        username,
        password,
    });
    store.commit('setAccessToken', response.access);
    store.commit('setRefreshToken', response.refresh);

    const decoded = jwtDecode(response.access) as Record<string, string>;
    store.commit('setAccessTokenExpiration', decoded.exp);
}



export async function refreshAccessToken() {
    const response =  await Api.post(`${config.gxpApi.baseUrl}/api/token/refresh/`, {
        refresh: store.getters.refreshToken,
    });
    store.commit('setAccessToken', response.access);
    return response.access;
}