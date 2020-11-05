/**
 *  home 
 */
import client from 'http/index.js'

const home = {
	namespaced: true,
	state: {
		letters: {
			loading: false,
			data: []
		},
		currentLetter: {}
	},
	getters: {
		letters: (state) => state.letters,
		currentletter: (state) => state.currentLetter
	},
	mutations: {
		updateLetters(state, payload) {
			state.letters = payload;
		},
		updateCurrentLetter(state, payload) {
			console.log(state,payload);
			state.currentLetter = payload;
			console.log(state.currentLetter);
		}
	},
	actions: {
		async updateAudio(state, payload) {
			const splitFilepath = payload.split('/');
			const {
				platform,
				model
			} = uni.getSystemInfoSync();
			const {
				fileID
			} = await uniCloud.uploadFile({
				filePath: payload,
				cloudPath: `audio-${platform}-${model}-${Date.now()}-${splitFilepath[splitFilepath.length-1]}`,
			})
			let {
				fileList: [{
					tempFileURL
				}]
			} = await uniCloud.getTempFileURL({
				fileList: [fileID]
			});
			return tempFileURL;

		},
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
			console.log();
			if (!code) state.commit('updateLetters', {
				data,
				loading: false
			})
		}
	}
}
export default home;
