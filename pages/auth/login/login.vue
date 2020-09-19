<template>
	<view class="">
		<view class="login">
			<view class=""><text class="tips">Welcome Back</text></view>
			<view class="textfield" style="margin-top: 50rpx;"><input placeholder="Email/Phone" focus style="flex: 1;" v-model="username" type="text" /></view>
			<view class="textfield" style="margin-top: 40rpx;">
				<input style="flex: 1;" focus="" v-model="code" placeholder="Password" type="password" />
				<text @click="handleSendCode">{{ msg }}</text>
			</view>
			<view class=""><button class="sumbit">login</button></view>
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getUserInfo" class="auth" @getuserinfo="handle_login_wechat"><text class="iconfont">&#xe937;</text></button>
			<!-- #endif -->
			<view class="" style="text-align: center; margin-top: 40rpx; font-size: 22rpx;">Z Join @{{ moment(timer.epoch).format('YYYY-MM-DD hh:mm:ss') }}</view>
		</view>
		<image class="bg-login" src="/static/login.svg" mode="scaleToFill"></image>
		<image class="bg-login-top-right" src="/static/bg-login.svg" mode="scaleToFill"></image>
		<image class="bg-login-bottom-left" :src="url" mode="aspectFill"></image>
		<text class="iconfont back" :style="{ top: `${statusBarHeight}px` }">&#xe6aa;</text>
	</view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			statusBarHeight: 0,
			timer: {},
			url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2b05e970-f9c6-11ea-9dfb-6da8e309e0d8.JPG',

			msg: '发送验证码',
			username: '',
			code: '',
			password: ''
		};
	},
	onLoad() {
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		uniCloud.callFunction({
			name: 'iso',
			success: ({ result }) => {
				this.timer = result;
			}
		});
	},
	methods: {
		moment,
		handle_login_wechat(e) {
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success(res) {
								console.log('----------------');
								console.log(res);
								uniCloud.callFunction({
									name: 'user-center',
									data: {
										action: 'loginByWeixin',
										params: {
											code: res.code
										}
									},
									success(e) {
										uni.showToast({
											icon: 'none',
											title: '欢迎加入z join',
											position: 'bottom'
										});
									}
								});
							},
							fail(err) {
								console.log('----------------');
								console.log(err);
								reject(new Error('微信登录失败'));
							}
						});
					}
				}
			});
		},
		async handle_sumbit() {
			const {
				result: { code, msg }
			} = await uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'verifyEmailCode',
					params: {
						email: this.username,
						type: 'register',
						code: this.code
					}
				}
			});
			if (!code) {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'register',
						params: {
							email: this.username,
							password: this.password
						}
					},
					success({ result: { code: rcode, msg: rmsg } }) {
						if (!rcode) {
							uni.showToast({
								icon: 'none',
								title: '欢迎加入z join',
								position: 'bottom'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: rmsg,
								position: 'bottom'
							});
						}
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: msg,
					position: 'bottom'
				});
			}
		},
		handleSendCode() {
			if (this.msg.endsWith('s')) return;
			uni.showLoading();
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'sendEmailCode',
					params: {
						email: this.username,
						type: 'register'
					}
				},
				success: res => {
					uni.hideLoading();
					if (!res.code) {
						uni.showToast({
							icon: 'none',
							title: '发送成功！',
							position: 'bottom'
						});
						this.msg = '60s';
						let timer;

						const start_timer = () => {
							timer = Number(this.msg.split('s')[0]);
							timer = timer - 1;
							this.msg = `${timer}s`;
							if (timer > 0) {
								setTimeout(() => {
									start_timer();
								}, 1000);
							} else {
								this.msg = `发送验证码`;
							}
						};
						start_timer();
					}
				},
				fail(e) {
					uni.hideLoading();
					console.error(e);
					uni.showModal({
						showCancel: false,
						content: '发送失败，请稍后再试'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
	display: grid;
	justify-content: center;
	align-items: flex-start;
	height: 100%;
	.login {
		margin-top: 200rpx;
		min-height: 40vh;
		width: 90vw;
		.tips {
			font-family: fantasy;
			font-weight: bold;
			letter-spacing: 8rpx;
		}
		.textfield {
			height: 100rpx;
			background-color: #ffffff;
			display: flex;
			border-radius: 10rpx;
			align-items: center;
			font-size: 28rpx;
			padding: 0 24rpx;
			margin-bottom: 20rpx;
		}
		.sumbit {
			height: 80rpx;
			margin-top: 60rpx;
			width: 100%;
			background-color: #000;
			color: #fff;
		}
		.auth {
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1rpx solid #000;
			height: 90rpx;
			width: 90rpx;
			border-radius: 50%;
			font-size: 60rpx;
			margin: 0 auto;
			margin-top: 40rpx;
		}
	}

	.back {
		position: fixed;
		left: 0;
		top: 0;
		height: 100rpx;
		width: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 48rpx;
	}
	.bg-login {
		position: fixed;
		bottom: 0;
		right: -30rpx;
		filter: drop-shadow(-10rpx 10rpx 10rpx rgba(0, 0, 0, 0.7));
	}
	.bg-login-top-right {
		position: fixed;
		top: -240rpx;
		right: -100rpx;
		filter: drop-shadow(-10rpx 10rpx 10rpx rgba(0, 0, 0, 0.7));
		transform: rotate(180deg);
	}
	.bg-login-bottom-left {
		position: fixed;
		left: 0;
		bottom: 0;
		mask: linear-gradient(45deg, #eee 2%, transparent 15%, transparent 10%);
	}
}
</style>
