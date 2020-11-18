/**
 * query letter
 * 
 */
const uniID = require('uni-id')
const db = uniCloud.database();
const collection = db.collection('uni-id-users');
const dbCmd = db.command

module.exports = async function(event) {
	uniCloud.logger.log('======user-center-query========')
	uniCloud.logger.log(JSON.stringify(event))
	result = await uniID.checkToken(event.token);
	if (result.code) return result;
	let pageSize = event.pageSize || 0;
	let page = event.page || 1;
	let skip = (page - 1) * pageSize;
	const {
		nickName,
		startDate,
		endDate,
	} = event
	let where = {};

	function getNow(time) {
		return new Date(time).getTime()
	}
	if (nickName)
		where.nickName = new RegExp(`${nickName}`);
	if (startDate && endDate)
		where.register_date = dbCmd.gte(getNow(startDate)).and(dbCmd.lte(getNow(endDate)));
	let {
		data
	} = await collection
		.where(where)
		.skip(skip)
		.limit(pageSize)
		.get();
	const {
		total
	} = await collection.where(where).count();
	uniCloud.logger.log(JSON.stringify({
		code: 0,
		data: {
			total,
			data
		}
	}))
	uniCloud.logger.log('======user-center-query-end========')
	return {
		code: 0,
		data: {
			total,
			data
		}
	}
}
