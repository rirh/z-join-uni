'use strict';
const request = require('request');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		url: params_url
	} = event;
	const host = 'https://6372-crypto2server-576164-1302901174.tcb.qcloud.la';
	const url = `${host}${params_url}`
	//返回数据给客户端
	return url
};
