export default {
    state: () => ({
        error: undefined as Error | undefined,
    }),
    mutations: {
        setError(state: any, error: Error) {
            state.error = error;
        },
    },
    getters: {
        error: (state: any) => {
            return state.error;
        },
    },
};
