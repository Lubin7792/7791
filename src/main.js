import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import $ from 'jquery';
import "../src/static/ztree/js/jquery-3.2.1.min";
import "../src/static/ztree/js/jquery.ztree.core.js";
import "../src/static/ztree/js/jquery.ztree.excheck";
import "../src/static/ztree/css/zTreeStyle/zTreeStyle.css";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Routers from './router/router.js';
import 'babel-polyfill';
import Vuex from 'vuex';
import store from './store/store.js';
import {
    Table,
    TableColumn
} from 'element-ui';

import 'babel-polyfill';
Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Table);
Vue.use(TableColumn);
// The routing configuration
const RouterConfig = {
    // 使用 HTML5 的 History 路由模式
    //   mode: "history",
    routes: Routers
};
const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    window.document.title = '天华星航备份软件';
    console.log("2222")
    next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});