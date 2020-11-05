/**
 *  add letter
 */
const db = uniCloud.database();
const collection = db.collection('letters');

module.exports = async function(event) {
	delete event.action;
	const docid = event._id || `id_${Date.now()}`;
	// 數據庫插入數據如果
	const {
		id
	} = await collection.doc(docid).set({
		...event
	})
	await uniID.updateUser({
		uid: event.uid,
		signature: event.desc,
	})
	return {
		code: Boolean(id) ? 0 : 500,
		message: Boolean(id) ? '操作成功' : '操作失败'
	}
}
