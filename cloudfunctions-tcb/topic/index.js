'use strict';
const db = uniCloud.database();
const collection = db.collection('topics');
const add = require('./add.js')
const query = require('./query.js')
const uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const params = event.action ? event : JSON.parse(event.body);
	let result = {}
	result = await uniID.checkToken(params.uniIdToken)
	if (result.code) return result;
	const action = params.type || params.action
	switch (action) {
		case 'add':
			result = await add(event)
			break;
		case 'query':
			result = await query(event)
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
