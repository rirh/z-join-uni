import lib from 'lib/utils';
import store from 'store/index.js'
import axios from './h5reauest.js';
const {
	showToast
} = lib;

function success(result, reslove, params) {
	console.log(result)
	switch (result.code) {
		case 0:
			reslove(result)
			break;
		case 30204:
		case 30203:
		case 30202:
		case 30201:
			store.dispatch('auth/logout')
		default:
			showToast(result.message)
			reject(result)
			break;
	}

	console.timeEnd()
	console.log(`============ ${params.name} end ===============`)
	console.groupEnd()
}

function fail(err, reject, params) {
	uni.hideLoading()
	console.log(err)
	reject(err)
	console.timeEnd()
	console.log(`============ error ${params.name} end ===============`)
	console.groupEnd()
	showToast(err.message)
}

export default (params) => {
	return new Promise((reslove, reject) => {
		console.group()
		console.time()
		console.log(`============${params.name} start===============`)
		params.data && console.log(params.data)
		// #ifdef H5
		axios({
				url: params.name,
				method: 'post',
				data: params.data
			})
			.then(result => success(result, reslove, params))
			.catch(err => fail(err, reject, params))
		// #endif
		// #ifndef H5
		uniCloud.callFunction(params)
			.then(({
				result
			}) => {
				console.log(result)
				switch (result.code) {
					case 0:
						reslove(result)
						break;
					case 30204:
					case 30203:
					case 30202:
					case 30201:
						store.dispatch('auth/logout')
					default:
						showToast(result.message)
						reject(result)
						break;
				}

				console.timeEnd()
				console.log(`============ ${params.name} end ===============`)
				console.groupEnd()
			})
			.catch(err => {
				uni.hideLoading()
				console.log(err)
				reject(err)
				console.timeEnd()
				console.log(`============ error ${params.name} end ===============`)
				console.groupEnd()
				showToast(err.message)
			})
		// #endif

	})
}
