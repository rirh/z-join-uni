'use strict';
const protocol = require('./protocol.js');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let params = event.params || {}
	let res = {}
	if (protocol[params.type]) {
		res.data = protocol[params.type];
		res.code = 0;
	} else {
		res.code = 801
		res.data = ''
	}
	uniCloud.logger.log(event)
	// uniCloud.logger.log(context)
	uniCloud.logger.log(res)
	//返回数据给客户端
	return res;
};
