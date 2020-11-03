'use strict';
const db = uniCloud.database();
const collection = db.collection('letters');
const uniID = require('uni-id')

exports.main = async (event, context) => {
	//event为客户端上传的参数

	uniCloud.logger.log('================event===============')
	uniCloud.logger.log(JSON.stringify(event))
	uniCloud.logger.log('================event end===========')
	let result = {}
	result = await uniID.checkToken(event.uniIdToken)
	if (result.code) return result;
	const action = event.type || event.action
	switch (action) {
		case "query":
			const {
				data
			} = await collection.where({
				uid: event.uid
			}).get()
			result = {
				code: 0,
				data
			}
			break;
		case 'insert':
			delete event.action
			const {
				id
			} = await collection.add({
				...event
			})
			if (id) {
				await uniID.updateUser({
					uid: event.uid,
					signature: event.desc,
				})
				result = {
					code: 0,
					message: '操作成功'
				}
			} else {
				result = {
					code: 500,
					message: '操作失败'
				}
			}
			break;
		case 'meetYou':
			const {
				data: letters
			} = await collection.where({
				_id: "b8df3bd65f913c7401a336545c52d0b4"
			}).get();
			result = {
				code: 0,
				data: letters
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
	uniCloud.logger.log('================result===============')
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('================result end===========')

	//返回数据给客户端
	return result
};
