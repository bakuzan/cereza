import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { createProvider } from './vue-apollo';

import Meta from 'vue-meta';

Vue.config.productionTip = false;
Vue.use(Meta);

new Vue({
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App)
}).$mount('#app');
