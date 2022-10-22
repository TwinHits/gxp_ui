import jwtDecode from 'jwt-decode';

import store from '@/store/index';

export function decodeExpirationDateFromJWT(token: any): number {
    const decoded = jwtDecode(token) as Record<string, string>;
    return parseInt(decoded.exp);
}

export function isAccessTokenExpired() {
    const expiration = store.getters.accessTokenExpiration;
    return expiration < new Date().valueOf();
}

export function isRefreshTokenExpired() {
    const expiration = store.getters.refreshTokenExpiration;
    return expiration < new Date().valueOf();
}