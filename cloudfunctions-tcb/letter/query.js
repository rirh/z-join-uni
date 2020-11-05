/**
 * query letter
 * 
 */
const db = uniCloud.database();
const collection = db.collection('letters');
module.exports = async function(event) {
	let pageSize = event.pageSize || 0;
	let page = event.page || 0;

	const uid = event.uid;
	let where = uid ? {
		uid
	} : {}
	let {
		data
	} = await collection
		.where(where)
		.skip(page * pageSize)
		.limit(pageSize)
		.orderBy("createtime", 'desc')
		.get();
	const {
		total
	} = await collection.where(where).count();
	return {
		code: 0,
		data: {
			total,
			data
		}
	}
}
