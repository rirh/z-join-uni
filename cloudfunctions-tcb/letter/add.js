/**
 *  add letter
 */
const uniID = require('uni-id');
const db = uniCloud.database();
const collection = db.collection('letters');
const {
	generateID
} = require('tools')
module.exports = async function(event) {
	uniCloud.logger.log('======letter-add========')
	delete event.action;
	const docid = generateID(event.desc);
	// 數據庫插入數據如果
	const {
		author = '',
			avatar = '',
			avatarUrl = '',
			catagory = '',
			contant = '',
			createtime,
			desc = '',
			loction = {},
			uid,
			audioPath = '',
			to = '',
			font = '',
			background = ''
	} = event;
	const {
		code,
		id,
		updated,
		...other
	} = await collection.doc(docid).set({

		author,
		avatarUrl: avatar || avatarUrl,
		catagory,
		contant,
		createtime,
		desc,
		loction,
		uid,
		audioPath,
		to,
		font,
		background

	});
	await uniID.updateUser({
		uid: event.uid,
		signature: event.desc,
	})
	const result = code === 0 || id || updated === 0 || updated;
	uniCloud.logger.log('======letter-add end========')
	return {
		code: Boolean(result) ? 0 : 500,
		message: Boolean(result) ? '操作成功' : '操作失败'
	}
}
