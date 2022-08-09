import axios, { AxiosRequestHeaders } from 'axios';
import oauth from 'axios-oauth-client';

import config from '@/../config.json';

import store from '@/store/index';

const axiosClient = axios.create();

/**
axiosClient.interceptors.request.use(
    async function (request) {
        const isAuthRequest = request.url?.includes(config.tokenUri);
        if (!isAuthRequest) {
            if (!request.headers) {
                request.headers = {};
            }
            request.headers['Authorization'] = `Bearer ${store.getters.auth.access_token}`;
            request.headers['Content-Type'] = 'application/json';
        }
        return request;
    },
    function (error) {
        return Promise.reject(error);
    },
);
**/

axiosClient.interceptors.response.use(
    function (response) {
        if (response.data?.errors) {
            throw new Error(response.data.errors[0].message)
        }
        return response;
    },
    function (error) {
        return Promise.reject(error);
    },
);

/** 
const getClientCredentials = oauth.client(axiosClient, {
    url: config.baseUrl + config.tokenUri,
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    baseURL: config.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function authenticate(): Promise<any> {
    try {
        if (store.getters.auth === undefined) {
            const authToken = await getClientCredentials();
            store.commit('setAuth', authToken);
        }
        return store.getters.auth;
    } catch (error) {
        console.error(error);
    }
}
**/

export async function post(url: string, body: any): Promise<any> {
    const response = await axiosClient.post(url, body);
    return response.data;
}

export async function get(url: string, queryParams?: any): Promise<any> {
    const response = await axios.get(url, { params: queryParams});
    return response.data;
}

export async function getWithBody(url: string, body: any): Promise<any> {
    const response = await axiosClient.get(url, body);
    return response.data;
}

export async function del(url: string) {
    const response = await axiosClient.delete(url);
    return response.data;
}

export async function put(url: string, body: any): any {
    const response = await axiosClient.put(url, body);
    return response.data;
}

export async function getAllPaginated(url: string, headers?: AxiosRequestHeaders): Promise<any[]> {
    let total = [] as any[];
    let nextUrl = url;
    while (nextUrl) {
        const response = await get(nextUrl);
        total = total.concat(response.results)
        nextUrl = response.next;
    }

    return total;
}