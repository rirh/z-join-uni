<template>
	<view class=""></view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {};
	},
	onLoad() {
		uni.navigateTo({
			url: '/pages/auth/login/login'
		});
	},
	methods: {}
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
