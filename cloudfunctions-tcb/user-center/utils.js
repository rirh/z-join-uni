let crypto = require('crypto') //引用加密模块
/*
 * 根据一个盐值加密生成随机的字符串
 * @function
 * @param {string} source 要转换的字符串
 */
const sha512 = function(source, salt) {
	const hash = crypto.createHmac('sha512', salt) // 盐值
	hash.update(source)
	const value = hash.digest('hex')
	console.log(value)
	return {
		salt: salt,
		Hash: value
	}
}
/*
 * 根据账号 返回一个6位随机加密字符串的方法
 * function 
 * @param {string} user
 */
function generateInviteCode(user) {
	let now = new Date().getTime().toString();
	let code = sha512(user, now) // 这里使用了timestemp作为盐值，让生成的抽奖码更不随机
	return code.Hash.substr(3, 6) // 如果需要更多位 可以多截取一些，也可以从不同位置截取
}

/**
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
function encrypt(algorithm, content) {
	let hash = crypto.createHash(algorithm)
	hash.update(content)
	return hash.digest('hex')
}
/**
 * @param {Object} content
 */
function sha1(content) {
	return encrypt('sha1', content)
}


module.exports = {
	generateInviteCode,
	sha1
}
