import Vue from 'vue';
import Vuex from 'vuex';

import Auth from '@/store/Auth';
import Error from '@/store/Error';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Auth,
        Error,
    },
});
