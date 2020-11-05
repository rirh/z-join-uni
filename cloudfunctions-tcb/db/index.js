'use strict';
/**
 * 此函数为数据库操作函数
 */
const db = uniCloud.database();
const collection = db.collection('letters');
exports.main = async (event, context) => {
	// const result = await collection.count()
	// console.log(result,result.total);
	// console.log(result.total+1);
	//event为客户端上传的参数
	// console.log('event : ', event)
	// const pageSize = 15;
	// const page = 2
	// const result = await collection.skip(page * pageSize).limit(pageSize).orderBy("name", 'asc').get();
	let result = await collection.where({
		
	}).get();
	// res.data.map(async(document) => {
	// 	console.log(document);
	//   return await collection.doc(document._id).remove();
	// });
	console.log(JSON.stringify(result));
	//返回数据给客户端
	return event
};
