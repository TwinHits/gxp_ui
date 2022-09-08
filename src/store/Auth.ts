export default {
    state: () => ({
        accessToken: undefined as string | undefined,
        refreshToken: undefined as string | undefined,
        accessTokenExpiration: undefined as number | undefined,
    }),
    mutations: {
        setAccessToken(state: any, accessToken: any) {
            state.accessToken = accessToken;
        },
        setRefreshToken(state: any, refreshToken: any) {
            state.refreshToken = refreshToken;
        },
        setAccessTokenExpiration(state: any, expiration: any) {
            state.accessTokenExpiration = expiration * 1000;
            console.log(state.accessTokenExpiration);
        },
    },
    getters: {
        accessToken: (state: any) => {
            return state.accessToken;
        },
        refreshToken: (state: any) => {
            return state.refreshToken;
        },
        accessTokenExpiration: (state: any) => {
            return state.accessTokenExpiration;
        },
        isLoggedIn: (state: any) => {
            return state.accessToken != undefined;
        },
    },
};
