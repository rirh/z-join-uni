import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js'
import home from './home.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		auth,home
	}
})
export default store
