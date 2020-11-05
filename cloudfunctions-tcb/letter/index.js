'use strict';
const db = uniCloud.database();
const collection = db.collection('letters');
const uniID = require('uni-id')
// 查詢模塊
const add = require('./add.js');
const remove = require('./remove.js');
const update = require('./update.js');
const query = require('./query.js');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	uniCloud.logger.log('================event===============')
	uniCloud.logger.log(JSON.stringify(event))
	uniCloud.logger.log('================event end===========')
	let result = {};
	result = await uniID.checkToken(event.uniIdToken)
	if (result.code) return result;
	const action = event.type || event.action
	switch (action) {
		case 'insert':
			result = await add(event);
			break;
		case 'delete':
			const res = remove(event)
			break;
		case "query":
			result = await query(event);
			break;
		default:
			result = {
				code: -1,
				data: null,
				message: '请求错误'
			}
			break;
	}
	uniCloud.logger.log('================result===============')
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('================result end===========')
	//返回数据给客户端
	return result
};
