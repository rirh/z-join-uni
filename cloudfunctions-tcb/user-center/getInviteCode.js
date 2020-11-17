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
	uniCloud.logger.log('======user-center-getInviteCode========')
	const {
		total
	} = await collection.count();
	const {
		data
	} = await collection.field({
		my_invite_code: true
	}).get()

	function getRandom(n, m) {
		var num = Math.floor(Math.random() * (m - n + 1) + n)
		return num
	}
	const {
		my_invite_code
	} = data[getRandom(0, total - 1)];
	result.data = my_invite_code || '获取失败，请重新发送';
	result.code = 0;
	uniCloud.logger.log(JSON.stringify(result))
	uniCloud.logger.log('======user-center-getInviteCode end====')
	//返回数据给客户端
	return result
};
