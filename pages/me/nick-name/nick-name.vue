<template>
	<view class="wapper">
		<view class="label">请输入昵称</view>
		<view class="value"><input v-model="nickName" type="text" placeholder="请输入昵称" /></view>
		<button class="sumbit" @click="handle_sumbit">确定修改</button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				nickName: '',
			};
		},
		computed: {
			...mapGetters({
				user: 'auth/user'
			})
		},
		onLoad() {
			this.nickName = this.user.nickName;
		},
		methods: {
			async handle_sumbit() {
				const {
					code
				} = await this.$store.dispatch('auth/update', {
					nickName: this.nickName,
				})
				if (!code) uni.navigateBack()
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
			background: #000;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			margin-top: 90rpx;
		}
	}
</style>
