<template>
	<view class="content">
		<view class="">{{ timer.iso }}</view>
		<view class="">{{ timer.epoch }}</view>
		<view class="textfild"><input v-model="username" type="text" /></view>
		<view class="textfild">
			<input style="flex: 1;" v-model="code" type="text" />
			<text @click="handleSendCode">{{ msg }}</text>
		</view>
		<view class="textfild"><input style="flex: 1;" v-model="password" type="text" /></view>
		<view><button @click="handle_sumbit" type="default">注册</button></view>
	</view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			timer: {},
			msg: '发送验证码',
			username: 'huibikuile@qq.com',
			code: '',
			password: ''
		};
	},
	onLoad() {
		uniCloud.callFunction({
			name: 'iso',
			success: ({ result }) => {
				this.timer = result;
			}
		});
	},
	methods: {
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

<style>
.content {
	display: grid;
	place-items: center;
	font-size: 32rpx;
	padding: 5vw;
	color: #333;
	background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2cd35670-f9c6-11ea-8ff1-d5dcf8779628.JPG');
}
.textfild {
	height: 80rpx;
	width: 100%;
	border: 1rpx solid #eee;
	display: flex;
	align-items: center;
	font-size: 24rpx;
	padding: 0 16rpx;
	margin-bottom: 20rpx;
}
</style>
