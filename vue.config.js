const path = require('path');
// 非得安装5.0.0的老版本 新版本会有问题 https://ask.dcloud.net.cn/question/97536
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	configureWebpack: config => {
		config.plugins = [
			...config.plugins,
			new CopyWebpackPlugin([{
				from: path.join(__dirname, '../cloudfunctions'),
				to: path.join(__dirname, 'unpackage', 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process
					.env.UNI_PLATFORM, 'cloudfunctions'),
			},]),
		]
	}
};
