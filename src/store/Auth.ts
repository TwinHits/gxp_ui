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
        setAccessTokenExpiration(state:any, expiration: any) {
            state.accessTokenExpiration = expiration * 1000;
        }
    },
    getters: {
        accessToken: (state: any) => {
            return state.accessToken;
        },
        refreshToken: (state: any) => {
            return state.refreshToken;
        },
        isAccessTokenExpired: (state: any) => {
            if (state.accessTokenExpiration) {
                return state.accessTokenExpiration < new Date().valueOf();
            } else {
                return false;
            }
        },
        isLoggedIn: (state: any) => {
            return state.accessToken != undefined;
        }
    },
};
