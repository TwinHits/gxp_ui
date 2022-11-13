import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import store from '@/store/index';

import * as AuthApi from '@/api/auth.api';
import * as AuthUtils from '@/common/utils/authUtils';

axios.interceptors.request.use(
    async function (request: AxiosRequestConfig) {
        if (!request.url?.includes('/api/token') && store.getters.isLoggedIn) {
            if (AuthUtils.isAccessTokenExpired()) {
                if (!AuthUtils.isRefreshTokenExpired()) {
                    await AuthApi.refreshAccessToken();
                } else {
                    store.commit('logout');
                    return request;
                }
            }

            if (!request.headers) {
                request.headers = {};
            }
            request.headers['Authorization'] = `Bearer ${store.getters.accessToken}`;
            request.headers['Content-Type'] = 'application/json';
        }
        return request;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log(error);
        const message = error.response?.data?.detail;
        store.commit('setError', message);
        return Promise.reject(error);
    },
);

export async function post(url: string, body?: any): Promise<any> {
    const response = await axios.post(url, body);
    return response.data;
}

export async function get(url: string, queryParams?: any): Promise<any> {
    const response = await axios.get(url, { params: queryParams });
    return response.data;
}

export async function getWithBody(url: string, body: any): Promise<any> {
    const response = await axios.get(url, body);
    return response.data;
}

export async function del(url: string) {
    const response = await axios.delete(url);
    return response.data;
}

export async function put(url: string, body?: any): Promise<any> {
    const response = await axios.put(url, body);
    return response.data;
}

export async function getAllPaginated(url: string, queryParams?: any, headers?: AxiosRequestHeaders): Promise<any[]> {
    let response = await get(url, queryParams);
    let total = response.results;
    let nextUrl = response.next;
    while (nextUrl) {
        response = await get(nextUrl);
        total = total.concat(response.results);
        nextUrl = response.next;
    }

    return total;
}
