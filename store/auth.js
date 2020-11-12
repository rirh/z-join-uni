/**
 *  auth 
 */
import client from 'http/index.js'

const auth = {
	namespaced: true,
	state: {
		isLogin: uni.getStorageSync('uniIdToken') && uni.getStorageSync('uniIdTokenExpired') > Date.now(),
		userinfo: {}
	},
	getters: {
		isLogin(state) {
			return state.isLogin;
		},
		user(state) {
			return state.userinfo || {};
		}
	},
	mutations: {
		updatePwd() {

		},
		update(state, {
			userInfo,
		}) {
			uni.setStorageSync('userinfo', userInfo);
			state.userinfo = userInfo;
			state.isLogin = true;
		},
		login(state, {
			token,
			userInfo,
			tokenExpired,
			uid
		}) {
			uni.setStorageSync('uniIdToken', token);
			uni.setStorageSync('uniIdTokenExpired', tokenExpired);
			uni.setStorageSync('userinfo', userInfo);
			uni.setStorageSync('uid', uid);

			state.userinfo = userInfo;
			state.isLogin = true;
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		logout(state) {
			const token = uni.getStorageSync('uniIdToken');
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'logout',
					token
				}
			})
			uni.removeStorageSync('uniIdToken')
			uni.removeStorageSync('uniIdTokenExpired')
			uni.removeStorageSync('userinfo')
			console.log('logout');
			state.userinfo = {};
			state.isLogin = false;
			uni.navigateTo({
				url: '/pages/auth/login/login',
			})

		}
	},
	actions: {
		async updatePwd(state, payload) {
			const {
				password
			} = uni.getStorageSync('userinfo')
			const uid = uni.getStorageSync('uid')
			const result = await client({
				name: 'user-center',
				data: {
					action: Boolean(password) ? 'updatePwd' : 'resetPwd',
					uid,
					...payload
				}
			})
			state.dispatch('getUserInfo')
			return result;
		},
		async getUserInfo(state) {
			const uid = uni.getStorageSync('uid')
			const result = await client({
				name: 'user-center',
				data: {
					uid,
					action: 'getUserInfo'
				}
			})
			state.commit('update', result)
		},
		login(state, params) {
			state.commit('login', params)
		},
		async update(state, params) {

			const uid = uni.getStorageSync('uid')
			const token = uni.getStorageSync('uniIdToken')
			const {
				code
			} = await client({
				name: 'user-center',
				data: {
					action: 'updateUser',
					uid,
					token,
					...params
				}
			})
			if (!code) state.dispatch('getUserInfo')
			return {
				code
			}
		},
		logout(state) {
			state.commit('logout')
			const token = uni.getStorageSync('uniIdToken')
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'logout',
					token
				}
			})
		}
	}
}
export default auth;
