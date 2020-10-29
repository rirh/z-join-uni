<template>
	<view>
		<view @click="handle_go_edit" class="setion" :style="{'padding':`${CustomBar}rpx 0`}">
			<image class="head-img" src="/static/user.svg" mode="scaleToFill"></image>
			<view class="user-info">
				<view class="">
					{{user._id}}
				</view>
				<view class="">
					id:{{user.email||user.mobile}}
				</view>
			</view>
		</view>
		<view class="setion active" style="margin-top: 16rpx;">
			<text class="label">设置</text>
		</view>
		<view class="setion active">
			<text class="label">关于</text>
		</view>
		<view @click="handle_logout" class="setion active" style="margin-top: 16rpx;">
			<text class="label">退出</text>
		</view>

		<!-- me
		<navigator url="/pages/words-like-meet/words-like-meet">/pages/words-like-meet/words-like-meet</navigator>
		<navigator url="/pages/auth/login/login">/pages/auth/login/login</navigator> -->
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {};
		},
		computed: {
			...mapGetters(['user'])
		},
		onLoad() {

		},
		onShow() {
			console.log(this.user);
			this.$http({
				name: 'user-center',
				data: {
					action: 'getUserInfo',
				},
			}).then((res) => {})

		},
		methods: {
			handle_go_edit() {
				uni.navigateTo({
					url: '/pages/auth/edit-user-info/edit-user-info'
				})
			},
			handle_logout() {
				this.$store.dispatch('logout')
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #eee;
	}

	.setion {
		background-color: #fff;
		position: relative;
		display: flex;
		min-height: 100rpx;
		align-items: center;

		.label {
			margin-left: 40rpx;
			font-weight: 400;
			font-size: 32rpx;
		}
	}

	.active:active {
		background-color: #d8d8d8;
	}

	.head-img {
		height: 150rpx;
		width: 150rpx;
		background-color: #fff;
		border-radius: 10rpx;
		margin-left: 40rpx;

	}

	.user-info {
		margin-left: 20rpx;
		font-size: 32rpx;
		font-weight: 600;
		text-transform: uppercase;
	}

	.setion::after {
		content: ' ';
		width: 200%;
		height: 200%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: inherit;
		transform: scale(0.5);
		transform-origin: 0 0;
		pointer-events: none;
		box-sizing: border-box;
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		border-top: 1rpx solid rgba(0, 0, 0, 0.1);
	}
</style>
