<template>
	<view class="wapper">
		<view class="edit-area">
			<view class="signature"></view>
			<view class="edit-btn">
			<navigator url="/pages/me/edit-signature/edit-signature"><button type="default">编辑个性签名</button></navigator>	</view>
		</view>
		<view class="goods">
			<view class="nav">
				<text @click="current = 0" :class="[current === 0 && 'actice-nav']" class="nav-item">装扮</text>
				<text @click="current = 1" :class="[current === 1 && 'actice-nav']" class="nav-item">字体</text>
			</view>
			<swiper :current="current" @change="changeCurrent" :indicator-dots="false">
				<swiper-item><view class="swiper-item">xxxx</view></swiper-item>
				<swiper-item><view class="swiper-item">xxxx</view></swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0
		};
	},
	methods: {
		changeCurrent(e) {
			const current = e.detail.current;
			this.current = current;
		}
	}
};
</script>

<style lang="scss">
.wapper {
	background-color: #eee;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.edit-area {
		min-height: 30vh;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		.signature {
			margin-top: 20rpx;
			padding: 20rpx;
			min-height: 250rpx;
			height: 250rpx;
			min-width: 650rpx;
			background-color: #d8d8d8;
			box-shadow: 0rpx 3rpx 3rpx -2rpx rgba(0, 0, 0, 0.2), 0rpx 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.14), 0rpx 1rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
		}
		.edit-btn {
			margin-top: 20rpx;
			margin-right: 25rpx;
			text-align: right;
			align-self: flex-end;
		}
	}
	.goods {
		flex: 1;
		background-color: #fff;
		.nav {
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			color: #666;
			font-size: 32rpx;
			transition: color 0.3s, font-weight 0.3s;
			background-color: #f8f8f8;
		}
		.actice-nav {
			color: #000;
			font-weight: bold;
			position: relative;
			font-size: 32rpx;
		}
		.actice-nav::after {
			content: ' ';
			position: absolute;
			bottom: 0;
			left: 0;
			height: 3rpx;
			width: 30rpx;
			border-radius: 20%;
		}
	}
	.swiper-item{
		padding: 40rpx;
	}
}
</style>
