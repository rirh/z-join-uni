'use strict';
const uniID = require('uni-id')
const nodemailer = require("nodemailer");
const mailer = require('./mailer.js')
const register = require('./register.js')
const login = require('./login.js')
exports.main = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	uniCloud.logger.log('==============user-center==============')
	uniCloud.logger.log(JSON.stringify(event))
	const action = event.action || JSON.parse(event.body).action || JSON.parse(event.body).type || '';
	uniCloud.logger.log(action)
	let result = {}
	switch (action) {
		case "register":
			result = await register(event.action ? event : JSON.parse(event.body))
			break;
		case "login":
			result = await login(event.action ? event : JSON.parse(event.body))
			break;
		default:
			break;
	}
	uniCloud.logger.log(result)
	uniCloud.logger.log('==============user-center end==========')

	//返回数据给客户端
	return result
};
