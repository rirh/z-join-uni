'use strict';
const crypto = require('crypto');
const {
	AppID,
	AppKey,
	AppSecret,
	MasterSecret
} = require('./config.js');

const baseUrl = `https://restapi.getui.com/v2/${AppID}`;


const server = uniCloud.httpclient;
/**
 * 获取token
 */
const fetch_token = async () => {
	return new Promise(async (reslove, reject) => {
		const timestamp = Date.now();
		const appkey = AppKey;
		const url = `${baseUrl}/auth`;
		const sign = require('crypto').createHash('sha256')
			.update(AppKey + timestamp + MasterSecret)
			.digest('hex');
		const data = {
			sign,
			timestamp,
			appkey
		}
		const params = {
			method: 'POST',
			contentType: 'json',
			dataType: 'json',
			data,
		}
		try {
			const {
				data: {
					data: {
						token
					}
				},
				code
			} = await server.request(url, (params))
			if (!code) reslove(token)
			else reslove('')
		} catch (e) {
			//TODO handle the exception
			reject(e)
		}
	})
}


const toSingle = async (cid) => {
	return new Promise(async (reslove, reject) => {
		const url = `${baseUrl}/push/single/cid`;
		const token = await fetch_token();
		try {
			const res = await server.request(url, {
				headers: {
					"content-type": "application/json",
					"token": token,
					"cache-control": "no-cache"
				},
				data: {
					"request_id": `request_id_${Date.now}`,
					"settings": {
						"ttl": 3600000
					},
					"audience": {
						"cid": [
							cid
						]
					},
					"push_message": {
						"notification": {
							"title": "请填写通知标题",
							"body": "请填写通知内容",
							"click_type": "url",
							"url": "https//:xxx"
						}
					}
				}
			})
			console.log(res.data.data)
			reslove(res)
		} catch (error) {
			reject(error)
		}

	})


}

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);

	const {
		type,
		data
	} = event;
	console.log(data);
	await toSingle(data.cid)
	//返回数据给客户端
	return event
};
