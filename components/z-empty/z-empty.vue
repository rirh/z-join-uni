<template>
	<view class="empty">
		<image class="empty-image" src="/static/no-data.svg" mode="scaleToFill"></image>
		<text style="margin-top: 40rpx;">{{tips}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			tips: {
				type: String,
				default: '这个人很懒，什么也没有留下~'
			},
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.empty {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: #666;
		font-size: 32rpx;
		padding-top: 10vmax;
	}

	.empty-image {
		height: 40vw;
		width: 30vw;
		filter: drop-shadow(-5rpx 5rpx 5rpx rgba(0, 0, 0, 0.4));

	}
</style>
