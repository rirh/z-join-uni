// const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	configureWebpack: config => {
		// config.plugins = [
		// 	...config.plugins,
		// 	new CopyWebpackPlugin([{
		// 		from: path.join(__dirname, '../cloudfunctions'),
		// 		to: path.join(__dirname, 'unpackage', 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process
		// 			.env.UNI_PLATFORM, 'cloudfunctions'),
		// 	},]),
		// ]
	}
};
