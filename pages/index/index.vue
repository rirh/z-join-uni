<template>
	<view class="">
		<image style="filter:drop-shadow(-25px 25px 25px rgba(26,58,70,0.7));" src="/static/login.svg" mode="scaleToFill"></image>
		<image class="bg-class" :src="images[4]" mode="aspectFill"></image>
		<!-- <view class="content">
			<text class="iconfont">&#xe937;</text>
			<view class="">{{ timer.iso }}</view>
			<view class="">{{ timer.epoch }}</view>
			<view class="textfild"><input v-model="username" type="text" /></view>
			<view class="textfild">
				<input style="flex: 1;" v-model="code" type="text" />
				<text @click="handleSendCode">{{ msg }}</text>
			</view>
			<view class="textfild"><input style="flex: 1;" v-model="password" type="text" /></view>
			<view><button @click="handle_sumbit" type="default">注册</button></view>
			<view class="setion" v-for="(image, index) in images" :key="index"><image :src="image" mode="scaleToFill"></image></view>
		</view> -->
	</view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			timer: {},
			images: [
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2d7080d0-f9c6-11ea-8ff1-d5dcf8779628.JPG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2cd35670-f9c6-11ea-8ff1-d5dcf8779628.JPG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2c2f0020-f9c6-11ea-8ff1-d5dcf8779628.JPG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2ba4c180-f9c6-11ea-8bd0-2998ac5bbf7e.JPG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2b05e970-f9c6-11ea-9dfb-6da8e309e0d8.JPG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2a7e1bd0-f9c6-11ea-9dfb-6da8e309e0d8.JPEG',
				'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/293b62a0-f9c6-11ea-8ff1-d5dcf8779628.JPEG'
			],
			msg: '发送验证码',
			username: 'huibikuile@qq.com',
			code: '',
			password: ''
		};
	},
	onLoad() {
		uni.navigateTo({
			url: '/pages/auth/login/login'
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
.bg-class {
	position: fixed;
	z-index: -1;
	height: 100vh;
	width: 100vw;
	left: 0;
	top: 0;
	mask: linear-gradient(45deg, #000 1%, transparent 6%, transparent 6%);
}
.content {
	display: grid;
	place-items: center;
	font-size: 32rpx;
	padding: 5vw;
	color: #333;
	/* background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/2cd35670-f9c6-11ea-8ff1-d5dcf8779628.JPG'); */
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
.setion {
	filter: blur();
}
</style>
