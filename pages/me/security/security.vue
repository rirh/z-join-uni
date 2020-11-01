<template>
	<view class="wapper">
		<view class="label">请输入旧密码</view>
		<view class="value"><input v-model="oldPassword" type="text" placeholder="请输入旧密码" /></view>
		<view class="label">请输入新密码</view>
		<view class="value"><input v-model="newPassword" type="text" placeholder="请输入新密码" /></view>
		<view class="label">请再次输入新密码</view>
		<view class="value"><input v-model="revPassword" type="text" placeholder="请再次输入新密码" /></view>
		<button class="sumbit" @click="handle_sumbit_password">确定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			oldPassword: '',
			newPassword: '',
			revPassword: ''
		};
	},
	methods: {
		async handle_sumbit_password() {
			const result = await this.$http({
				name: 'user-center',
				data: {
					action: 'updatePwd',
					oldPassword: this.oldPassword,
					newPassword: this.newPassword,
					password_confirmation: this.revPassword
				}
			});
			console.log(result);
		}
	}
};
</script>

<style lang="scss">
.wapper {
	height: 100vh;
	width: 100vw;
	background-color: #eee;

	.label {
		// height: 90rpx;
		font-size: 26rpx;
		color: #666;
		padding-top: 40rpx;
		margin: 0 40rpx;
	}
	.value {
		display: flex;
		align-items: center;
		height: 90rpx;
		background-color: #fff;
		padding: 0 40rpx;
		margin: 20rpx 0;
	}
	.sumbit {
		height: 80rpx;
		width: 90vw;
		margin-left: 5vw;
		background: #6c63ff;
		color: #fff;
		font-size: 32rpx;
		text-align: center;
		margin-top: 90rpx;
	}
}
</style>
