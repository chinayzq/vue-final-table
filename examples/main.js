import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
/* main.js */
// 导入组件库
import VueFinalTable from './../packages/index';
import * as filters from './filters'; // 全局过滤器
// 注册组件库
Vue.use(VueFinalTable);
Vue.config.productionTip = false;
Vue.use(ElementUI);

// 注册全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
