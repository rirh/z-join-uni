'use strict';
const db = uniCloud.database();
const collection = db.collection('topics');
const add = require('./add.js')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const action = event.action;
	let result = {}
	switch (action) {
		case 'add':
			result = await add(event)
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
