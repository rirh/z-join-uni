'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const letter =
		`那一天我二十一岁，在我一生的黄金时代。我有好多奢望。我想爱，想吃，还想在一瞬间变成天上半明半暗的云。后来我才知道，生活就是个缓慢受锤的过程，人一天天老下去，奢望也一天天消失，最后变得像挨了锤的牛一样。可以我过二十一岁的生日时没有遇见这一点，我觉得自己会永远生猛下去，什么也锤不了我。`
	let result = {}
	switch (event.type) {
		case 'letterContext':
			result = {
				code: 200,
				data: letter
			}
			break;
		default:
			result = {
				code: -1,
				data: null,
				message: '请求错误'
			}
			break;
	}
	//返回数据给客户端
	return result
};
