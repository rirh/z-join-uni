/**
 * delete letter
 * 
 */
const uniID = require('uni-id')
const db = uniCloud.database();
const collection = db.collection('uni-id-users');

module.exports = async function(event) {
	uniCloud.logger.log('======user-center-delete========')
	uniCloud.logger.log(JSON.stringify(event))
	result = await uniID.checkToken(event.token);
	if (result.code) return result;
	const res = await collection.doc(event.uid).remove();
	uniCloud.logger.log('======user-center-delete-end========')
	return {
		code: 0,
		data: res
	}
}
