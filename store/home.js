/**
 *  auth 
 */
import client from 'http/index.js'

const home = {
	namespaced: true,
	state: {
		letters: {
			loading: false,
			data: []
		}
	},
	getters: {
		letters: (state) => state.letters

	},
	mutations: {
		updateLetters(state, payload) {
			state.letters = payload;
		}
	},
	actions: {
		async insterLetter(state, payload) {
			const result = await client({
				name: 'letter',
				data: {
					action: 'insert',
					...payload
				}
			})
			return result;
		},
		async fetchLetters(state, params) {
			state.commit('updateLetters', {
				data: [],
				loading: true
			})
			const {
				data,
				code
			} = await client(params);
			if (!code) state.commit('updateLetters', {
				data,
				loading: false
			})
		}
	}
}
export default home;
