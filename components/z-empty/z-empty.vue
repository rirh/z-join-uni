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
				default: '這裏空空~'
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
	}

	.empty-image {
		height: 50vw;
		width: auto;
	}
</style>
