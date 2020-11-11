'use strict';
const uniID = require('uni-id')
const mailer = require('./mailer.js')

module.exports = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log('======user-center-loginByEmail========')
	uniCloud.logger.log(JSON.stringify(event))
	let result;
	const {
		username: user,
		password,
		needPermission = true,
		email,
		phone,
		code
	} = event;
	const username = user || email || phone;
	result = await uniID.loginByEmail({
		email,
		code,
		needPermission,
	})
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-loginByEmail end====')
	//返回数据给客户端
	return result
};
