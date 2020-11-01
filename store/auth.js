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
			return state.userinfo;
		}
	},
	mutations: {
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
			tokenExpired
		}) {
			uni.setStorageSync('uniIdToken', token);
			uni.setStorageSync('uniIdTokenExpired', tokenExpired);
			uni.setStorageSync('userinfo', userInfo);
			state.userinfo = userInfo;
			state.isLogin = true;
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		logout(state) {
			uni.removeStorageSync('uniIdToken')
			uni.removeStorageSync('uniIdTokenExpired')
			uni.removeStorageSync('userinfo')
			console.log('logout');
			state.userinfo = {};
			state.isLogin = false;
			uni.navigateTo({
				url: '/pages/auth/login/login'
			})
		}
	},
	actions: {
		async getUserInfo(state) {
			const {
				_id
			} = uni.getStorageSync('userinfo')
			const result = await client({
				name: 'user-center',
				data: {
					uid: _id,
					action: 'getUserInfo'
				}
			})
			state.commit('update', result)
		},
		login(state, params) {
			state.commit('login', params)
		},
		logout(state) {
			const token = uni.getStorageSync('uniIdToken')
			client({
					name: 'user-center',
					data: {
						action: 'logout',
						token
					}
				})
				.then(res => {
					state.commit('logout')
				})
		}
	}
}
export default auth;
