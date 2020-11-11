import lib from 'lib/utils';
import store from 'store/index.js'
const {
	showToast
} = lib;

export default (params) => {
	return new Promise((reslove, reject) => {
		console.group()
		console.time()
		console.log(`============${params.name} start===============`)
		params.data && console.log(params.data)
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
	})
}
