/**
 *  add topic
 */
const db = uniCloud.database();
const collection = db.collection('topics');
const {
	generateID
} = require('tools')

module.exports = async function(event) {
	delete event.action;
	const docid = generateID(event.name);
	// 數據庫插入數據
	const {
		data
	} = await collection.where({
		name: event.name
	}).get()
	const {
		code,
		id,
		updated
	} = await collection.doc(docid).set({
		name: event.name,
		subscription: data.length + 1

	});
	const result = code === 0 || id || updated === 0 || updated;
	return {
		code: Boolean(result) ? 0 : 500,
		message: Boolean(result) ? '操作成功' : '操作失败'
	}
}
