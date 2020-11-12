'use strict';
const uniID = require('uni-id')
const register = require('./register.js')
const loginByEmail = require('./loginByEmail.js')
const sendEmailCode = require('./sendEmailCode.js')
const updateUserInfo = require('./updateUserInfo.js')
exports.main = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log('==============user-center==============')
	uniCloud.logger.log(JSON.stringify(event))
	const action = event.action || JSON.parse(event.body).action || JSON.parse(event.body).type || '';
	uniCloud.logger.log(action)
	let result = {}
	const params = event.action ? event : JSON.parse(event.body);
	switch (action) {
		case "register":
			result = await register(params)
			break;
		case "login":
			result = await login(params)
			break;
		case "loginByEmail":
			result = await loginByEmail(params)
			result.userInfo = {
				...result.userInfo
			}
			break;
		case "sendEmailCode":
			const code = await sendEmailCode(params)
			params.code = code;
			params.type = "login";
			result = await uniID.setVerifyCode(params);
			break;
		case "bindEmail":
			result = await uniID.bindEmail({
				uid: params.uid,
				email: params.email,
			})
			break;
		case "unbindEmail":
			result = await uniID.unbindEmail({
				uid: params.uid,
				email: params.email,
			})
			break;
		case "loginByWeixin":
			result = await uniID.loginByWeixin({
				code: params.code
			})
			if (!result.userInfo) updateUserInfo({
				...params.detail
			});
			result.userInfo = {
				...params.detail,
				...result.userInfo
			}
			break;
		case "getUserInfo":
			result = await uniID.getUserInfo({
				uid: params.uid,
			})
			break;
		case "updateUser":
			result = await updateUserInfo(params)
			break;
		case "resetPwd":
			result = await uniID.resetPwd({
				uid: params.uid,
				password: params.newPassword
			})
			break;
		case "updatePwd":
			result = await uniID.updatePwd(params)
			break;
		case "logout":
			result = await uniID.logout(event.token)
			break;
		default:
			result = {
				code: 400,
				msg: 'fail : please check you args action.'
			}
			break;
	}
	uniCloud.logger.log(result)
	uniCloud.logger.log('==============user-center end==========')

	//返回数据给客户端
	return result
};
