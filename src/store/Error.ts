export default {
    state: () => ({
        error: undefined as string | undefined,
    }),
    mutations: {
        setError(state: any, error: string) {
            state.error = error;
        },
    },
    getters: {
        error: (state: any) => {
            return state.error;
        },
    },
};
