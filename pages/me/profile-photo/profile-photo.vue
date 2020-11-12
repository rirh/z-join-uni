<template>
	<view>
		<view class="loading" :style="{width:`${loading}vw`,display:`${loading>0?'block':'none'}`}"></view>
		<view class="wapper">
			<image @click="handleUpload" class="avatar" :src="path" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		components: {

		},
		computed: {
			...mapGetters({
				user: 'auth/user'
			})
		},
		data() {
			return {
				path: '',
				loading: 0
			}
		},
		onLoad() {
			this.path = this.user.avatar || '/static/headimg.svg'
		},
		methods: {
			handlePreview() {
				uni.previewImage({
					urls: this.path,
					longPressActions: {
						itemList: ['保存图片'],
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			handleChooseImage(sourceType) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType, //从相册选择
					success: async (res) => {
						uni.showLoading()
						console.log(res);
						const {
							platform,
							model
						} = uni.getSystemInfoSync();
						let [filePath] = res.tempFilePaths;
						let [filefiles] = res.tempFiles;
						const splitFilepath = filePath.split('/');
						uniCloud.uploadFile({
							filePath,
							cloudPath: `image-${platform}-${model}-${Date.now()}-${splitFilepath[splitFilepath.length-1]}`,
							success: async ({
								fileID
							}) => {
								let {
									fileList: [{
										tempFileURL
									}]
								} = await uniCloud.getTempFileURL({
									fileList: [fileID]
								});
								this.$store.dispatch('auth/update', {
									avatarUrl: tempFileURL
								})
								uni.hideLoading()
								this.path = tempFileURL;
							},
							fail(err) {
								console.log(err);
							}
						})
					}
				});
			},
			handleUpload() {
				uni.showActionSheet({
					itemList: ['查看大图', '拍照上传', '相册上传'],
					success: (res) => {
						switch (Number(res.tapIndex)) {
							case 0:
								this.handlePreview()
								break;
							case 1:
								this.handleChooseImage(['camera'])
								break;
							case 2:
								this.handleChooseImage(['album'])
								break;
							default:
								break;
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.loading {
		height: 1rpx;
		background-color: #6C63FF;
		z-index: 1;
	}

	.wapper {
		height: 100vh;
		width: 100vw;
		background-color: black;
		display: flex;
		justify-content: center;

		.avatar {
			max-height: 40vh;
			max-width: 100vw;
			margin-top: 20vh;
			// border-radius: 50%;
		}
	}
</style>
