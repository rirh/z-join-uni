'use strict';
const db = uniCloud.database();
const collection = db.collection('letters');
const uniID = require('uni-id');
const tools = require('tools');
const {
	isJSON
} = tools
// 查詢模塊
const add = require('./add.js');
const remove = require('./remove.js');
const update = require('./update.js');
const query = require('./query.js');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	uniCloud.logger.log('================letter event===============')
	uniCloud.logger.log(JSON.stringify(event))
	event = isJSON(event) ? JSON.parse(event) : event;
	const params = event.action ? event : JSON.parse(event.body);
	let result = {};
	let token = params.uniIdToken;
	if (event.headers && event.headers['x-token']) token = event.headers['x-token'];
	result = await uniID.checkToken(token)
	console.log(result);
	if (result.code) return result;
	const action = event.action || JSON.parse(event.body).action || JSON.parse(event.body).type || '';
	switch (action) {
		case 'insert':
			result = await add(params);
			break;
		case 'delete':
			result = await remove(params)
			break;
		case "query":
			result = await query(params);
			break;
		default:
			result = {
				code: -1,
				data: null,
				message: '请求错误'
			}
			break;
	}
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('================letter end===========')
	//返回数据给客户端
	return result
};
