'use strict';
const uniID = require('uni-id')
const mailer = require('./mailer.js')
const {
	generateInviteCode
} = require('./utils.js')
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
		code,
		role,
		type,
		my_invite_code
	} = event;
	const username = user || email || phone;
	result = await uniID.loginByEmail({
		email: username,
		code,
		needPermission,
	})
	console.log(my_invite_code);
	if (my_invite_code) {
		await uniID.acceptInvite({
			uid: result.uid,
			inviteCode: my_invite_code
		})
		const myInviteCode = await generateInviteCode(username).toUpperCase();
		const encResult = await uniID.encryptPwd(password)
		await uniID.updateUser({
			uid: result.uid,
			password: encResult,
			username
		})
		await uniID.setUserInviteCode({
			uid: result.uid,
			myInviteCode
		})
	}

	if (role && role.length) {
		await uniID.bindRole({
			uid: result.uid,
			roleList: role
		})
	}
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-loginByEmail end====')
	//返回数据给客户端
	return result
};
