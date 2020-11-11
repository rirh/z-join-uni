'use strict';
const uniID = require('uni-id');
const mailer = require('./mailer.js');
const {
	generateInviteCode
} = require('./utils.js')
/**
 * 1、用户注册
 * 2、判断用户名类型
 * 3、绑定邮箱/手机
 */

module.exports = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log('======user-center-reister========')
	uniCloud.logger.log(JSON.stringify(event))
	let result;
	const {
		username: user,
		password,
		needPermission = true,
		email,
		phone
	} = event;
	const username = user || email || phone;
	const myInviteCode = generateInviteCode(username).toUpperCase();
	result = await uniID.register({
		username,
		password,
		needPermission,
		myInviteCode
	})
	const isCorrectEmail = /.+@.+/.test(username);
	const isCorrectPhone = /^1\d{10}$/.test(username);
	//绑定邮箱
	if (isCorrectEmail && result.code === 0) {
		uniID.bindEmail({
			email: username,
			uid: result.uid
		})
	}
	// 绑定手机号
	if (isCorrectPhone && result.code === 0) {
		uniID.mobileInfo({
			mobile: username,
			uid: result.uid
		})
	}

	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-reister end====')
	//返回数据给客户端
	return result
};
