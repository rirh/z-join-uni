import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js'
import home from './home.js'
import discover from './discover.js'
import topic from './topic.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		auth,
		home,
		discover,
		topic
	}
})
export default store
