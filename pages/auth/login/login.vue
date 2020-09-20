<template>
	<view class="">
		<view class="login">
			<view class=""><text class="tips">Welcome Back</text></view>
			<view class="textfield" style="margin-top: 50rpx;">
				<input placeholder="Email/Phone" :focus="focus_cursor === 'user'" style="flex: 1;" v-model="username" type="text" />
			</view>
			<view class="textfield" style="margin-top: 40rpx;">
				<input style="flex: 1;" :focus="focus_cursor === 'code'" v-model="code" placeholder="Code" type="number" />
				<text @click.stop="handleSendCode">{{ msg }}</text>
			</view>
			<view class=""><button :loading="loading" @click="handle_sumbit" class="sumbit">登&nbsp;录</button></view>
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getUserInfo" class="auth" @getuserinfo="handle_login_wechat"><text class="iconfont">&#xe937;</text></button>
			<!-- #endif -->
			<view class="protocol">
				<text @click.stop="handle_toggle_agreen" class="iconfont" style="margin-right: 15rpx;font-size: 28rpx;">{{ agreen ? '&#xe69f;' : '&#xe86b;' }}</text>
				<text @click.stop="handle_toggle_agreen">请认证阅读并同意</text>
				<navigator url="/pages/auth/protocol/protocol">《用户服务协议》</navigator>
				<navigator url="/pages/auth/privacy/privacy">《隐私权政策》</navigator>
			</view>
			<view class="" style="text-align: center; margin-top: 40rpx; font-size: 22rpx;">Z Join @{{ moment(timer.epoch).format('YYYY-MM-DD hh:mm:ss') }}</view>
		</view>
		<image class="bg-login" src="/static/login.svg" mode="scaleToFill"></image>
		<image class="bg-login-top-right" src="/static/bg-login.svg" mode="scaleToFill"></image>
		<image class="bg-login-bottom-left" :src="url" mode="aspectFill"></image>
		<text class="iconfont back" @click="handle_back" :style="{ top: `${statusBarHeight}px` }">&#xe6aa;</text>
	</view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			focus_cursor: 'user',
			statusBarHeight: 0,
			timer: {},
			url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2b05e970-f9c6-11ea-9dfb-6da8e309e0d8.JPG',
			msg: '发送验证码',
			username: '',
			code: '',
			password: '',
			loading: false,
			agreen: true
		};
	},
	onLoad() {
		this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.$nextTick(() => {
			uniCloud.callFunction({
				name: 'iso',
				success: ({ result }) => {
					this.timer = result;
				}
			});
		});
	},
	methods: {
		moment,
		handle_toggle_agreen() {
			this.agreen = !this.agreen;
		},
		handle_back() {
			uni.navigateBack();
		},
		handle_login_wechat(e) {
			if (!this.agreen) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请阅读并同意用户服务协议及隐私权政策'
				});
				return;
			}
			uni.showLoading();
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
										uni.hideLoading();
										uni.showToast({
											icon: 'none',
											title: '欢迎加入z join',
											position: 'bottom'
										});
										uni.switchTab({
											url: '/pages/index/index'
										});
									},
									fail(e) {
										uni.showToast({
											icon: 'none',
											title: '欢迎加入z join',
											position: 'bottom'
										});
										uni.hideLoading();
									}
								});
							},
							fail(err) {
								uni.showModal({
									content: err,
									showCancel: false
								});
								uni.hideLoading();
								console.log('----------------');
								console.log(err);
								reject(new Error('微信登录失败'));
							}
						});
					}
				},
				fail: () => {
					uni.hideLoading();
				}
			});
		},
		async handle_sumbit() {
			if (!this.agreen) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '请阅读并同意用户服务协议及隐私权政策'
				});
				return;
			}
			const isEmail = this.username.indexOf('@') > -1;
			let params;
			if (isEmail) {
				params = {
					action: 'verifyEmailCode',
					params: {
						email: this.username,
						type: 'register',
						code: this.code
					}
				};
				if (!/.+@.+/.test(this.username)) {
					uni.showModal({
						content: '请输入正确的邮箱',
						showCancel: false
					});
					return;
				}
			} else {
				params = {
					action: 'verifyMobileCode',
					params: {
						mobile: this.username,
						type: 'register',
						code: this.code
					}
				};
				if (!/^1\d{10}$/.test(this.username)) {
					uni.showModal({
						content: '请输入正确的手机号',
						showCancel: false
					});
					return;
				}
			}
			if (!this.code) {
				uni.showModal({
					content: '请输入验证码',
					showCancel: false
				});
				return;
			}
			this.loading = true;
			const {
				result: { code, msg }
			} = await uniCloud.callFunction({
				name: 'user-center',
				data: params
			});
			if (!code) {
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'auth',
						params: {
							[isEmail ? 'email' : 'mobile']: this.username,
							code: this.code
						}
					},
					success: res => {
						this.loading = false;
						if (!res?.result?.code) {
							uni.setStorageSync('uniIdToken', res.result.token);
							uni.switchTab({
								url: '/pages/index/index'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res?.result?.msg,
								position: 'bottom'
							});
						}
					},
					fail(e) {
						console.log(e);
					}
				});
			} else {
				this.loading = false;
				uni.showToast({
					icon: 'none',
					title: msg,
					position: 'bottom'
				});
			}
		},
		async handleSendCode() {
			if (this.msg.endsWith('s')) return;
			this.focus_cursor = 'code';
			let params;

			const isEmail = this.username.indexOf('@') > -1;
			if (isEmail) {
				params = {
					action: 'sendEmailCode',
					params: {
						email: this.username,
						type: 'register'
					}
				};
				if (!/.+@.+/.test(this.username)) {
					uni.showModal({
						content: '请输入正确的邮箱',
						showCancel: false
					});
					return;
				}
			} else {
				params = {
					action: 'sendSmsCode',
					params: {
						mobile: this.username,
						type: 'register'
					}
				};
				if (!/^1\d{10}$/.test(this.username)) {
					uni.showModal({
						content: '请输入正确的手机号',
						showCancel: false
					});
					return;
				}
			}
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
			uni.showLoading();
			uniCloud.callFunction({
				name: 'user-center',
				data: params,
				success: res => {
					uni.hideLoading();
					if (!res.code) {
						uni.showToast({
							icon: 'none',
							title: '发送成功！',
							position: 'bottom'
						});
						this.msg = '60s';
						this.code = '';
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
		margin-top: 18vh;
		min-height: 40vh;
		width: 90vw;
		z-index: 1;
		.tips {
			font-family: cursive;
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
		.protocol {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			margin-top: 40rpx;
			z-index: 2;
			> navigator {
				color: #666;
			}
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
		font-size: 58rpx;
	}
	.bg-login {
		position: fixed;
		bottom: 0;
		right: -30rpx;
		filter: drop-shadow(-10rpx 10rpx 10rpx rgba(0, 0, 0, 0.7));
	}
	.bg-login-top-right {
		position: fixed;
		top: -200rpx;
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
