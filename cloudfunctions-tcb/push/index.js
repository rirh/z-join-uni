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
		console.log(token)
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

async function otoSingle(cid) {
	const payload = JSON.stringify({
		data: "【单推】数据"
	})
	const push_message = {
		"transmission": payload
	}
	const push_channel = {
		"android": {
			"ups": {
				"notification": {
					'title': 'test',
					"body": 'test',
					"channel_level": 3,
					"click_type": "intent",

				}
			}
		},
		"ios": {
			"type": "notify",
			payload,
			"aps": {
				"alert": {
					"title": "请填写ios标题",
					"body": "请填写ios内容"
				},
				"content-available": 0,
				"sound": "pushsound.caf"
			},
			"auto_badge": "+1",
		}
	}
	const requestData = {
		request_id: "uni" + Date.now() + "push",
		audience: {
			"cid": [cid]
		},
		push_message,
		push_channel
	}
	let res = await post('/push/single/cid', requestData)
	return res.data;
}


async function post(url, requestData) {
	const token = await fetch_token();
	console.log(url, JSON.stringify({
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"token": token,
			"cache-control": "no-cache"
		},
		contentType: 'json',
		dataType: "json",
		data: requestData,
	}));
	return await uniCloud.httpclient.request(url, {
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"token": token,
			"cache-control": "no-cache"
		},
		contentType: 'json',
		dataType: "json",
		data: requestData,
	})
}

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	const token = await fetch_token();
	console.log(token);
	//返回数据给客户端
	return event
};
