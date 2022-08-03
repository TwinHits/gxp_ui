export default {
    state: () => ({
        auth: undefined as any | undefined,
    }),
    mutations: {
        setAuth(state: any, auth: any) {
            state.auth = auth;
        },
    },
    getters: {
        auth: (state: any) => {
            return state.auth;
        },
    },
};
