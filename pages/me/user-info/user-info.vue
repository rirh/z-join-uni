<template>
	<view class="wapper">
		<view class="loading" :style="{ width: `${loading}vw`, display: `${loading > 0 ? 'block' : 'none'}` }"></view>
		<view class="avatar-wapper">
			<navigator url="/pages/me/profile-photo/profile-photo">
				<image class="avatar shadow" @load="loading = 0" :src="avatar || '/static/headimg.svg'" mode="scaleToFill"></image>
			</navigator>
		</view>
		<uni-section title="基本信息" type="line"></uni-section>
		<navigator url="/pages/me/nick-name/nick-name">
			<view class="section">
				<view class="label">
					昵称
				</view>
				<view class="contant">
					{{user.nickName||''}}
				</view>
				<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
			</view>
		</navigator>
		<view class="section" style="margin-bottom: 40rpx;" @click="handle_toggle_sex">
			<view class="label">
				性别
			</view>
			<view class="contant">
				{{user.gender?'男':'女'}}
			</view>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>

		<uni-section title="附加信息" type="line"></uni-section>
		<view class="section">
			<view class="label">
				注册IP
			</view>
			<view class="contant" style="color: #666;margin-right:20rpx ;">
				{{user.register_ip}}
			</view>
		</view>
		<view class="section">
			<view class="label">
				注册时间
			</view>
			<view class="contant" style="color: #666;margin-right:20rpx ;">
				{{ moment(user.register_date).format('YYYY-MM-DD hh:mm')}}
			</view>
		</view>
		<view class="section" style="margin-bottom: 40rpx;">
			<view class="label">
				系统语言
			</view>
			<view class="contant" style="color: #666;margin-right:20rpx ;">
				{{ user.language}}
			</view>
		</view>


		<uni-section title="个性签名" type="line"></uni-section>
		<view class="section">
			<view class="label">
				这个人很懒什么也没有留下
			</view>
		</view>
		<!-- <view @click="handle_select_head" class="setion solid-bottom">
			<text class="label">头像</text>
			<view class="contant"><image @load="loading = 0" :src="avatar || '/static/headimg.svg'" mode="scaleToFill"></image></view>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view> -->
	</view>
</template>

<script>
	import moment from 'moment';
	import uniSection from 'components/uni-section/uni-section.vue'
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			uniSection
		},
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
			moment,
			handle_toggle_sex() {
				uni.showActionSheet({
					itemList: ['男', '女'],
					success: async (res) => {
						uni.showLoading()
						const {
							code
						} = await this.$store.dispatch('auth/update', {
							gender: Number(res.tapIndex) ? 0 : 1,
						})
						uni.hideLoading()
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
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
								onUploadProgress: ({
									loaded,
									total
								}) => {
									this.loading = Math.round((loaded * 100) / total);
								},
								success: async ({
									fileID
								}) => {
									console.log(fileID);
									try {
										const {
											fileList
										} = await uniCloud.getTempFileURL({
											fileList: [fileID]
										});
										const [{
											tempFileURL
										}] = fileList;
										uni.hideLoading();
										this.$store.dispatch('auth/update', {
											name: 'user-center',
											data: {
												uid: this.user._id,
												action: 'setAvatar',
												avatar: tempFileURL
											}
										})
										this.avatar = tempFileURL;
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
		height: 24vh;
		min-height: 300rpx;
		display: grid;
		place-items: center;

		.avatar {
			height: 200rpx;
			width: 200rpx;
			border-radius: 50%;
		}
	}

	.section {
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 20rpx 0;

		.label {
			font-weight: 400;
			font-size: 32rpx;
			margin-left: 20rpx;
			color: #333;

		}

		.contant {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			color: #333;
			font-size: 32rpx;
			font-weight: 400;
		}

		.allow-right {
			height: 55rpx;
			width: 55rpx;
			margin-right: 20rpx;
			justify-self: flex-end;
		}
	}
</style>
