/**
 *  remove letter
 */
const db = uniCloud.database();
const collection = db.collection('letters');

module.exports = async function(event) {
	delete event.action;
	const id = event.id || event.uid;
	uniCloud.logger.log('======letter-delete========')
	const res = await collection.doc(id).remove();
	uniCloud.logger.log(res);
	uniCloud.logger.log('======letter-delete end====')
	return {
		code: 0,
		message: '操作成功'
	}
}
