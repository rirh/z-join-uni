/**
 * 發送郵件
 */
const uniID = require('uni-id')
const mailer = require('./mailer.js')
/**
 * @param {Object} email
 */
module.exports = async (event) => {
	uniCloud.logger.log('======user-center-sendemail========')
	uniCloud.logger.log(JSON.stringify(event))
	let result = '';
	const email = event.email;
	const res = await mailer(email);
	result = res.code;
	uniCloud.logger.log(result)
	uniCloud.logger.log('======user-center-sendemail end=====')
	return result;
}
