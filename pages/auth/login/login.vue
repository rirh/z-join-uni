<template>
	<view class="" :style="{ 'padding-top': CustomBar + 'rpx' }">
		<!-- <image class="back" src="/static/back.svg" @click="handle_back" :style="{ top: `${statusBarHeight}px` }"></image> -->
		<view class="login">
			<view class=""><text class="tips">Welcome Back</text></view>
			<view class="textfield" style="margin-top: 40rpx;">
				<input placeholder="邮箱 / 手机号" :focus="focus_cursor === 'user'" style="flex: 1;" v-model="username" type="text" />
			</view>
			<view class="textfield" style="margin-top: 30rpx;">
				<input style="flex: 1;" :focus="focus_cursor === 'code'" v-model="code" placeholder="验证码" type="number" />
				<text @click.stop="handleSendCode">{{ msg }}</text>
			</view>
			<view class=""><button :loading="loading" @click="handle_sumbit" class="sumbit">登&nbsp;&nbsp;&nbsp;录</button></view>
			<!-- #ifdef MP-WEIXIN -->
			<button open-type="getUserInfo" class="auth" @getuserinfo="handle_login_wechat">
				<image class="wechat" src="/static/wechat.svg" mode="scaleToFill"></image>
			</button>
			<!-- #endif -->
			<view class="protocol">
				<image @click.stop="handle_toggle_agreen" class="" mode="scaleToFill" :src="`${agreen ? '/static/radio-seleted.svg' : '/static/radio.svg'}`"></image>
				<text @click.stop="handle_toggle_agreen">请认证阅读并同意</text>
				<navigator url="/pages/auth/protocol/protocol">《用户服务协议》</navigator>
				<navigator url="/pages/auth/privacy/privacy">《隐私权政策》</navigator>
			</view>
			<view class="" style="text-align: center; margin-top: 40rpx; font-size: 22rpx;">Z Join @{{ moment(timer.epoch).format('YYYY-MM-DD hh:mm') }}</view>
		</view>
		<image class="bg-login" src="/static/login.svg" mode="scaleToFill"></image>
		<image class="bg-login-top-right" src="/static/bg-login.svg" mode="scaleToFill"></image>
		<image class="bg-login-bottom-left" :src="url" mode="aspectFill"></image>
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
				username: 'only_tigerhu@163.com',
				code: '',
				password: '',
				loading: false,
				agreen: true
			};
		},
		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.$nextTick(async () => {
				const result = await this.$http({
					name: 'iso'
				});
				this.timer = result;
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
			handle_login_wechat({
				detail
			}) {
				if (!this.agreen) {
					this.$showToast('请阅读并同意用户服务协议及隐私权政策')

					return;
				}
				uni.showLoading();
				uni.getProvider({
					service: 'oauth',
					success: res => {
						if (~res.provider.indexOf('weixin')) {
							console.log(detail);
							uni.login({
								provider: 'weixin',
								success: res => {
									this.$http({
										name: 'user-center',
										data: {
											action: 'loginByWeixin',
											code: res.code,
											detail: detail.userInfo
										}
									}).then(result => {
										uni.hideLoading();
										this.$store.dispatch('auth/login', result);
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
					this.$showToast('请阅读并同意用户服务协议及隐私权政策');
					return;
				}
				if (!this.code) {
					uni.showModal({
						content: '请输入验证码',
						showCancel: false
					});
					return;
				}
				const isCorrectEmail = /.+@.+/.test(this.username);
				const isCorrectPhone = /^1\d{10}$/.test(this.username);
				if (!isCorrectEmail && !isCorrectPhone) {
					uni.showModal({
						content: '请输入正确的邮箱',
						showCancel: false
					});
					return;
				}
				if (!isCorrectPhone && !isCorrectEmail) {
					uni.showModal({
						content: '请输入正确的手机号',
						showCancel: false
					});
					return;
				}

				let params = {
					action: isCorrectEmail ? 'loginByEmail' : 'loginBySms',
					code: Number(this.code),
					[isCorrectEmail ? 'email' : 'phone']: this.username
				};
				this.loading = true;
				try {
					const result = await this.$http({
						name: 'user-center',
						data: params
					});
					console.log(result)
					const {
						code,
						msg
					} = result;
					this.loading = false;
					if (!code) {
						this.$store.dispatch('auth/login', result);
					} else {
						this.loading = false;
						this.$showToast(msg);
					}

				} catch (e) {
					this.loading = false;
					//TODO handle the exception
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
						email: this.username,
						type: 'register'
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
						mobile: this.username,
						type: 'register'
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
				this.$http({
					name: 'user-center',
					data: params
				}).then(() => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '发送成功！',
						position: 'bottom'
					});
					this.msg = '60s';
					this.code = '';
					start_timer();
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #eee;
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
				font-size: 36rpx;
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
				margin-top: 50rpx;
				width: 100%;
				background-color: #000;
				color: #fff;
			}

			.auth {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 60rpx;
				margin: 0 auto;
				margin-top: 60rpx;
				background-color: #eee;
				// width: 80rpx;

				.wechat {
					height: 80rpx;
					width: 80rpx;
					transform: translate(0rpx, 0rpx);
				}

				.wechat:active {
					transform: translate(1rpx, 1rpx);
				}
			}

			.auth:active {
				background-color: #eee !important;
			}



			.protocol {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				margin-top: 40rpx;
				z-index: 2;

				>image {
					height: 40rpx;
					width: 40rpx;
					margin-right: 10rpx;
				}

				>navigator {
					color: #666;
				}
			}
		}

		.back {
			position: fixed;
			left: 5vw;
			top: 0;
			height: 60rpx;
			width: 60rpx;
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

		.button-hover {
			background-color: none !important;
			transform: translate(0rpx, 0rpx);
		}
	}
</style>
