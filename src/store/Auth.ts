import * as AuthUtils from '@/common/utils/authUtils';

export default {
    state: () => ({
        isLoggedIn: !!localStorage.getItem('refreshTokenExpiration'),
        accessToken: localStorage.getItem('accessToken'),
        accessTokenExpiration: localStorage.getItem('accessTokenExpiration'),
        refreshToken: localStorage.getItem('refreshToken'),
        refreshTokenExpiration: localStorage.getItem('refreshTokenExpiration'),
    }),
    mutations: {
        setAccessToken(state: any, accessToken: any) {
            const expiration = AuthUtils.decodeExpirationDateFromJWT(accessToken);

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('accessTokenExpiration', String(expiration * 1000));

            state.accessToken = localStorage.getItem('accessToken');
            state.accessTokenExpiration = localStorage.getItem('accessTokenExpiration');
            state.isLoggedIn = true;
        },
        setRefreshToken(state: any, refreshToken: any) {
            const expiration = AuthUtils.decodeExpirationDateFromJWT(refreshToken);

            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('refreshTokenExpiration', String(expiration * 1000));

            state.refreshToken = localStorage.getItem('refreshToken');
            state.refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
            state.isLoggedIn = true;
        },
        logout(state: any) {
            localStorage.setItem('accessToken', '');
            localStorage.setItem('refreshToken', '');
            localStorage.setItem('accessTokenExpiration', '');
            localStorage.setItem('refreshTokenExpiration', '');

            state.refreshToken = localStorage.getItem('refreshToken');
            state.refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
            state.accessToken = localStorage.getItem('accessToken');
            state.accessTokenExpiration = localStorage.getItem('accessTokenExpiration');
            state.isLoggedIn = false;
        }
    },
    getters: {
        accessToken: (state: any) => {
            return state.accessToken;
        },
        refreshToken: (state: any) => {
            return state.refreshToken;
        },
        accessTokenExpiration: (state: any) => {
            if (state.accessTokenExpiration) {
                return parseInt(state.accessTokenExpiration);
            } else {
                return 0;
            }
        },
        refreshTokenExpiration: (state: any) => {
            if (state.refreshTokenExpiration) {
                return parseInt(state.refreshTokenExpiration);
            } else {
                return 0;
            }
        },
        isLoggedIn: (state: any) => {
            return state.isLoggedIn;
        },
    },
};
