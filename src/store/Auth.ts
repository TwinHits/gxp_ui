export default {
    state: () => ({
        isLoggedIn: false,
    }),
    mutations: {
        setAccessToken(state: any, accessToken: any) {
            localStorage.setItem('accessToken', accessToken)
            state.isloggedIn = !!localStorage.getItem('accessToken');
        },
        setRefreshToken(state: any, refreshToken: any) {
            localStorage.setItem('refreshToken', refreshToken)
        },
        setAccessTokenExpiration(state: any, expiration: number) {
            localStorage.setItem('accessTokenExpiration', String(expiration * 1000));
        },
    },
    getters: {
        accessToken: (state: any) => {
            return localStorage.getItem('accessToken');
        },
        refreshToken: (state: any) => {
            return localStorage.getItem('refreshToken');
        },
        accessTokenExpiration: (state: any) => {
            const expiration = localStorage.getItem('accessTokenExpiration');
            if (expiration) {
                return parseInt(expiration);
            } else {
                return expiration;
            }
        },
        isLoggedIn: (state: any) => {
            return state.isLoggedIn || localStorage.getItem('accessToken');
        },
    },
};
