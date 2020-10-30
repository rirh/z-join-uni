import Vue from 'vue'
import store from 'store'
import http from 'http/index.js'
import App from './App'
import lib from 'lib/utils'

const {
	showToast
} = lib;

Vue.config.productionTip = false;
App.mpType = 'app'

Vue.prototype.$http = http;
Vue.prototype.$showToast = showToast;

const app = new Vue({
	store,
	...App,
})
app.$mount()
