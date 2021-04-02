import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// Vue.config.productionTip = false

new Vue({
  router,
  data() {
    return {
      name: "sss"
    }
  },
  render: h => h(App)
}).$mount('#app');