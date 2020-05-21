import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/directory',
    name: 'Directory',
    component: () =>
      import(/* webpackChunkName: "directory" */ '../views/Directory.vue')
  },
  {
    path: '/gallery-reader',
    name: 'Reader',
    component: () =>
      import(/* webpackChunkName: "reader" */ '../views/Reader.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return new Promise((resolve) =>
        window.setTimeout(() => {
          resolve({ selector: to.hash });
        }, 1000)
      );
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;
