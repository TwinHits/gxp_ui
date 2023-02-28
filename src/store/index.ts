import Vue from 'vue';
import Vuex from 'vuex';

import Auth from '@/store/Auth';
import Error from '@/store/Error';
import Experience from '@/store/Experience';
import Raiders from '@/store/Raiders';
import Raids from '@/store/Raids';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Auth,
        Error,
        Experience,
        Raiders,
        Raids,
    },
});
