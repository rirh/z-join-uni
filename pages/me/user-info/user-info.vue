<template>
	<view class="wapper">
		<view class="loading" :style="{ width: `${loading}vw`, display: `${loading > 0 ? 'block' : 'none'}` }"></view>
		<view class="avatar-wapper"><image class="avatar" @load="loading = 0" :src="avatar || '/static/headimg.svg'" mode="scaleToFill"></image></view>
		<view @click="handle_select_head" class="setion solid-bottom">
			<text class="label">头像</text>
			<view class="contant"><image @load="loading = 0" :src="avatar || '/static/headimg.svg'" mode="scaleToFill"></image></view>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			loading: 0,
			avatar: ''
		};
	},
	computed: {
		...mapGetters({
			user: 'auth/user'
		})
	},
	onLoad() {
		this.avatar = this.user.avatar;
	},
	methods: {
		handle_select_head() {
			uni.chooseImage({
				count: 1,
				success: async res => {
					console.log(res);
					if (res.tempFilePaths.length > 0) {
						let [filePath] = res.tempFilePaths;
						let [filefiles] = res.tempFiles;
						uni.showLoading();
						this.loading = 1;
						uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: filefiles.name,
							onUploadProgress: ({ loaded, total }) => {
								this.loading = Math.round((loaded * 100) / total);
							},
							success: async ({ fileID }) => {
								console.log(fileID);
								try {
									const { fileList } = await uniCloud.getTempFileURL({
										fileList: [fileID]
									});
									const [{ tempFileURL }] = fileList;
									uni.hideLoading();
									this.$http({
										name: 'user-center',
										data: {
											action: 'setAvatar',
											avatar: tempFileURL
										}
									}).then(() => {
										this.avatar = tempFileURL;
									});
								} catch (e) {
									//TODO handle the exception
									console.log(e);
								}
							},
							fail: err => {
								console.log(err);
								uni.hideLoading();
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page,
.wapper {
	background-color: #eee;
}
.loading {
	height: 1rpx;
	background-color: #6c63ff;
	z-index: 1;
}
.avatar-wapper {
	height: 30vh;
	min-height: 300rpx;
	display: grid;
	place-items: center;
	.avatar {
		height: 200rpx;
		width: 200rpx;
		border-radius: 50%;
	}
}

.setion {
	display: flex;
	align-items: center;
	padding: 20rpx 0;

	.label {
		font-weight: 400;
		font-size: 32rpx;
		margin-left: 20rpx;
	}

	.contant {
		flex: 1;
		display: flex;
		justify-content: flex-end;

		> image {
			height: 100rpx;
			width: 100rpx;
			border-radius: 50%;
			overflow: hidden;
		}
	}

	.allow-right {
		height: 55rpx;
		width: 55rpx;
		margin-right: 20rpx;
		justify-self: flex-end;
	}
}
</style>
