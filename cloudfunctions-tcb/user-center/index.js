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
	let params = event.params || JSON.parse(event.body) || {}
	let payload = {}
	uniCloud.logger.log(JSON.stringify(event))
	let noCheckAction = ['register', 'checkToken', 'encryptPwd', 'login', 'loginByWeixin', 'sendSmsCode',
		'setVerifyCode', 'loginBySms', 'loginByEmail', 'sendEmailCode', 'verifyEmailCode', 'verifyMobileCode',
		'auth', 'getUserInfo'
	]
	let action = event.action || params.action;
	if (noCheckAction.indexOf(action) === -1) {
		if (!event.uniIdToken) {
			return {
				code: 403,
				msg: '缺少token'
			}
		}
		payload = await uniID.checkToken(event.uniIdToken)
		if (payload.code && payload.code > 0) {
			return payload
		}
		params.uid = payload.uid
	}
	let res = {}

	switch (action) {
		case 'getUserInfo':
			payload = await uniID.checkToken(event.uniIdToken)
			if (payload.code && payload.code > 0) {
				return payload
			}
			res = await uniID.getUserInfo({
				uid: payload.uid,
				field: ['mobile']
			})
			return res
			break;
		case 'auth':
			const login_code = 888888;
			await uniID.setVerifyCode({
				[params.email ? 'email' : 'mobile']: params.email || params.mobile,
				code: login_code,
				expiresIn: 300,
				type: 'login'
			})
			if (params.email) {
				res = await uniID.loginByEmail({
					...params,
					code: login_code
				})
			} else if (params.mobile) {
				res = await uniID.loginBySms({
					...params,
					code: login_code
				})
			} else {
				res = {
					code: 801,
					msg: '请输入账号'
				}
			}
			if (res.code !== 0) {
				res = await uniID.register({
					...params,
					password: '123456'
				});
			}
			break;
		case 'verifyMobileCode':
			res = await uniID.verifyCode({
				mobile: params.mobile,
				code: params.code,
				type: params.type
			})
			uniCloud.logger.info(res)
			break;
		case 'verifyEmailCode':
			res = await uniID.verifyCode({
				email: params.email,
				code: params.code,
				type: params.type
			})
			uniCloud.logger.info(res)
			break;
		case 'sendEmailCode':
			const {
				code
			} = await mailer(params.email)
			res = await uniID.setVerifyCode({
				email: params.email,
				code,
				expiresIn: 300,
				type: params.type
			})
			break;
		case 'register':
			res = await uniID.register(params);
			break;
		case 'login':
			res = await uniID.login({
				...params,
				// 不指定queryField的情况下只会查询username
				queryField: ['username', 'email', 'mobile']
			});
			break;
		case 'logout':
			res = await uniID.logout(event.uniIdToken);
			break;
		case 'updatePwd':
			res = await uniID.updatePwd(params);
			break;
		case 'setAvatar':
			res = await uniID.setAvatar(params);
			break;
		case 'bindMobile':
			res = await uniID.bindMobile(params);
			break;
		case 'unbindMobile':
			res = await uniID.unbindMobile(params);
			break;
		case 'bindEmail':
			res = await uniID.bindEmail(params);
			break;
		case 'unbindEmail':
			res = await uniID.unbindEmail(params);
			break;
		case 'loginByWeixin':
			res = await uniID.loginByWeixin(params.code);
			break;
		case 'bindWeixin':
			res = await uniID.bindWeixin(params);
			break;
		case 'unbindWeixin':
			res = await uniID.unbindWeixin(params.uid);
			break;
		case 'loginByAlipay':
			res = await uniID.loginByAlipay(params.code);
			break;
		case 'bindAlipay':
			res = await uniID.bindAlipay(params);
			break;
		case 'unbindAlipay':
			res = await uniID.unbindAlipay(params.uid);
			break;
		case 'checkToken':
			// 注意1.1.0版本会返回userInfo，请不要返回全部信息给客户端
			const checkTokenRes = await uniID.checkToken(event.uniIdToken)
			res = {
				code: checkTokenRes.code,
				msg: checkTokenRes.msg
			}
			break;
		case 'resetPwd':
			res = await uniID.resetPwd({
				uid: params.uid,
				password: '123456'
			});
			break;
		case 'encryptPwd':
			const password = await uniID.encryptPwd('123456');
			res = {
				code: 0,
				msg: '密码加密完成',
				password
			}
			break;
		case 'sendSmsCode':
			res = await uniID.sendSmsCode(params);
			break;
		case 'setVerifyCode':
			res = await uniID.setVerifyCode(params);
			break;
		case 'loginBySms':
			res = await uniID.loginBySms(params);
			break;
		case 'loginByEmail':
			res = await uniID.loginByEmail(params);
			break;
		case 'updateUser':
			res = await uniID.updateUser(params);
			break;
		case 'setUserInviteCode':
			res = await uniID.setUserInviteCode(params);
			break;
		case 'acceptInvite':
			res = await uniID.acceptInvite(params);
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}
	uniCloud.logger.log(res)
	//返回数据给客户端
	return res
};
