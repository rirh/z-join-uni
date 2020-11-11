'use strict';
const uniID = require('uni-id')

module.exports = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log('======user-center-update-user-info========')
	uniCloud.logger.log(JSON.stringify(event))
	let result;
	delete event.action;
	result = await uniID.updateUser({
		...event,
	})
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-update-user-info end====')
	//返回数据给客户端
	return result
};
