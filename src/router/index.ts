import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: Home,
    },
];

const router = new VueRouter({
    routes,
    scrollBehavior() {
        // always scroll to top
        return { x: 0, y: 0 };
    },
});

export default router;
