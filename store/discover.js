/**
 *  discover 
 */
import client from 'http/index.js'

const discover = {
	namespaced: true,
	state: {
		letters: [],
	},
	getters: {
		letters: (state) => state.letters,
	},
	mutations: {
		updateLetters(state, payload) {
			state.letters = payload;
		},

	},
	actions: {
		async fetchLetters(state, params) {
			state.commit('updateLetters', data)
			const {
				data,
				code
			} = await client(params);
			console.log();
			if (!code) state.commit('updateLetters', data)
		}
	}
}
export default discover;
