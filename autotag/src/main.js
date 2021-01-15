import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import test from "./components/test"
// Vue.config.productionTip = false

let ff=new Vue({
  router,
  data(){
    return {name:"sss"}
  },
  render: h => h(App)
}).$mount('#app');
window.obj={App:test,name:"wuwei"}
console.log(window.obj);
console.log(222222222222);
console.dir(ff.name);