import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//引入全局样式
import './assets/gloable.css'
//引入request.js
import request from '@/utils/request.js'
import store from './store/store';

Vue.config.productionTip = false;
//引入request.js
Vue.prototype.request = request;


//设置大小，适配屏幕
Vue.use(ElementUI, {size: "mini"});


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
