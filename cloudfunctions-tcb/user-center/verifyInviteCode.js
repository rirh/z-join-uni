'use strict';
const db = uniCloud.database();
const collection = db.collection('uni-id-users');

module.exports = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	let result = {}
	uniCloud.logger.log('======user-center-verifyInviteCode========')
	if (!event.my_invite_code) {
		return {
			code: 200,
			message: '请输入邀请码'
		}
	}
	const {
		data
	} = await collection.where({
		my_invite_code: event.my_invite_code
	}).get()
	if (!data.length) {
		return {
			code: 200,
			message: '请输入正确的邀请码'
		}
	}
	result.message = '验证通过';
	result.code = 0;
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-verifyInviteCode end====')
	//返回数据给客户端
	return result
};
