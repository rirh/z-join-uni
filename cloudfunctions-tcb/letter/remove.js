/**
 *  remove letter
 */
const db = uniCloud.database();
const collection = db.collection('letters');

module.exports = async function(event) {
	delete event.action;
	const res = await collection.doc(event._id).remove()
	return {
		code: 0,
		message: '操作成功'
	}
}
