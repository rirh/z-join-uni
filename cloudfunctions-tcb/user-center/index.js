'use strict';
const uniID = require('uni-id')
const nodemailer = require("nodemailer");
const mailer = require('./mailer')

exports.main = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log(JSON.stringify(event))
	const action = event.action || JSON.parse(event.body) || ''
	const noCheckAction = [
		'setAvatar',
		'register',
		'checkToken',
		'encryptPwd',
		'login',
		'loginByWeixin',
		'sendSmsCode',
		'setVerifyCode',
		'loginBySms',
		'loginByEmail',
		'sendEmailCode',
		'verifyEmailCode',
		'verifyMobileCode',
		'auth',
		'getUserInfo',
		'logout'
	]
	let result = {}

	if (noCheckAction.indexOf(action) === -1) {
		if (!event.uniIdToken) {
			return {
				code: 403,
				msg: '缺少token'
			}
		}
		result = await uniID.checkToken(event.uniIdToken)
		console.log(JSON.stringify(result));

		if (result.code && result.code > 0) {
			return result
		}
	}

	switch (action) {
		case 'updateUser':
			console.log('updateUser' + JSON.stringify(event));
			result = await uniID.updateUser({
				uid: event.uid,
				...event,
			})
			break;
		case 'setAvatar':
			result = await uniID.setAvatar({
				uid: event.uid,
				avatar: event.avatar
			})
			break;
		case 'logout':
			result = await uniID.logout(event.token)
			break;
		case 'getUserInfo':
			result = await uniID.getUserInfo({
				uid: event.uid,
			})
			return result
			break;
		case 'auth':
			const login_code = 888888;
			await uniID.setVerifyCode({
				[event.email ? 'email' : 'mobile']: event.email || event.mobile,
				code: login_code,
				expiresIn: 300,
				type: 'login'
			})
			if (event.email) {
				result = await uniID.loginByEmail({
					...event,
					code: login_code
				})
			} else if (event.mobile) {
				result = await uniID.loginBySms({
					...event,
					code: login_code
				})
			} else {
				result = {
					code: 801,
					msg: '请输入账号'
				}
			}
			if (result.code !== 0) {
				result = await uniID.register({
					...event,
					password: '123456'
				});
			}
			break;
		case 'verifyMobileCode':
			result = await uniID.verifyCode({
				mobile: event.mobile,
				code: event.code,
				type: event.type
			})
			uniCloud.logger.info(result)
			break;
		case 'verifyEmailCode':
			result = await uniID.verifyCode({
				email: event.email,
				code: event.code,
				type: event.type
			})
			uniCloud.logger.info(result)
			break;
		case 'sendEmailCode':
			const {
				code
			} = await mailer(event.email)
			console.log(code);
			result = await uniID.setVerifyCode({
				email: event.email,
				code,
				expiresIn: 300,
				type: event.type
			})
			break;
		case 'register':
			result = await uniID.register(event);
			break;
		case 'login':
			result = await uniID.login({
				...event,
				// 不指定queryField的情况下只会查询username
				queryField: ['username', 'email', 'mobile']
			});
			break;
		case 'logout':
			result = await uniID.logout(event.uniIdToken);
			break;
		case 'updatePwd':
			result = await uniID.updatePwd(event);
			break;
		case 'setAvatar':
			result = await uniID.setAvatar(event);
			break;
		case 'bindMobile':
			result = await uniID.bindMobile(event);
			break;
		case 'unbindMobile':
			result = await uniID.unbindMobile(event);
			break;
		case 'bindEmail':
			result = await uniID.bindEmail(event);
			break;
		case 'unbindEmail':
			result = await uniID.unbindEmail(event);
			break;
		case 'loginByWeixin':
			result = await uniID.loginByWeixin(event.code);
			if(!result.userInfo.avatar)
			await uniID.updateUser({
				uid: result.uid,
				avatar: event.detail.avatarUrl,
				...event.detail
			})
			break;
		case 'bindWeixin':
			result = await uniID.bindWeixin(event);
			break;
		case 'unbindWeixin':
			result = await uniID.unbindWeixin(event.uid);
			break;
		case 'loginByAlipay':
			result = await uniID.loginByAlipay(event.code);
			break;
		case 'bindAlipay':
			result = await uniID.bindAlipay(event);
			break;
		case 'unbindAlipay':
			result = await uniID.unbindAlipay(event.uid);
			break;
		case 'checkToken':
			// 注意1.1.0版本会返回userInfo，请不要返回全部信息给客户端
			const checkTokenRes = await uniID.checkToken(event.uniIdToken)
			result = {
				code: checkTokenRes.code,
				msg: checkTokenRes.msg
			}
			break;
		case 'resetPwd':
			result = await uniID.resetPwd({
				uid: event.uid,
				password: '123456'
			});
			break;
		case 'encryptPwd':
			const password = await uniID.encryptPwd('123456');
			result = {
				code: 0,
				msg: '密码加密完成',
				password
			}
			break;
		case 'sendSmsCode':
			result = await uniID.sendSmsCode(event);
			break;
		case 'setVerifyCode':
			result = await uniID.setVerifyCode(event);
			break;
		case 'loginBySms':
			result = await uniID.loginBySms(event);
			break;
		case 'loginByEmail':
			result = await uniID.loginByEmail(event);
			break;
		case 'updateUser':
			result = await uniID.updateUser(event);
			break;
		case 'setUserInviteCode':
			result = await uniID.setUserInviteCode(event);
			break;
		case 'acceptInvite':
			result = await uniID.acceptInvite(event);
			break;
		default:
			result = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}
	uniCloud.logger.log(result)
	//返回数据给客户端
	return result
};
