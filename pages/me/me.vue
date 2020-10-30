<template>
	<view>
		<view @click="handle_go_edit" class="setion">
			<image class="head-img" src="/static/headimg.svg" mode="scaleToFill"></image>
			<view class="user-info">
				<view class="">
					<text class="user">{{ user.email || user.mobile }} </text>
				</view>
				<view class="">
					<text class="id">id:{{ user._id }}</text>
				</view>
			</view>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>
		<view class="setion active" style="margin-top: 16rpx">
			<image class="label-icon" src="/static/setting.svg" mode="scaleToFill"></image>
			<text class="label flex-sub">设置</text>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>
		<view class="setion active">
			<image class="label-icon" src="/static/about.svg" mode="scaleToFill"></image>
			<text class="label flex-sub">关于</text>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>
		<view @click="handle_logout" class="setion active" style="margin-top: 16rpx">
			<image class="label-icon" src="/static/exit.svg" mode="scaleToFill"></image>
			<text class="label">退出</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {};
		},
		computed: {
			...mapGetters(["user"]),
		},
		onLoad() {},
		onShow() {
			this.$http({
				name: "user-center",
				data: {
					action: "getUserInfo",
				},
			}).then((res) => {});
		},
		methods: {
			handle_go_edit() {
				uni.navigateTo({
					url: "/pages/me/user-info/user-info",
				});
			},
			handle_logout() {
				this.$http({
					name: 'user-center',
					data: {
						action: 'logout',
					}
				}).then(() => {
					this.$store.dispatch("logout");
				})
			},
		},
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
			font-weight: 400;
			font-size: 32rpx;
		}

		.label-icon {
			height: 45rpx;
			width: 45rpx;
			margin: 0 20rpx;
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
		margin: 20rpx;
	}

	.allow-right {
		height: 55rpx;
		width: 55rpx;
		margin-right: 20rpx;
		justify-self: flex-end;
	}

	.user-info {
		margin-left: 20rpx;
		font-size: 32rpx;
		font-weight: 600;
		flex: 1;

		.user {
			font-size: 20rpx;
			// text-transform: capitalize;
		}

		.id {
			font-size: 16rpx;
			color: #666;
		}
	}

	.setion::after {
		content: " ";
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
