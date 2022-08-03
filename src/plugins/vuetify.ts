// Vuetify configuration

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);
const opts = {
    theme: { 
        disable: true 
    },
};

export default new Vuetify(opts);
