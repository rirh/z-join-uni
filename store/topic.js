/**
 *  topic 
 */
import client from 'http/index.js'

const topic = {
	namespaced: true,
	state: {
		topic: [],
	},
	getters: {
		topiclist: (state) => state.topic,
	},
	mutations: {
		updateTopic(state, payload) {
			state.topic = payload;
		},
	},
	actions: {
		async addTopic(state, params) {
			return await client(params);
			// if (!code) state.dispatch('fetchTopic', data)
		},
		async fetchTopic(state, params) {
			const {
				data,
				code
			} = await client(params);
			if (!code) state.commit('updateTopic', data.data)
		}
	}
}
export default topic;
