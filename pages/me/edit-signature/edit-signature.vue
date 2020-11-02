<template>
	<view class="wapper">
		<view class="textarea"><textarea v-model="signature" :row="3" placeholder="请输入个性签名" :auto-focus="true" /></view>
		<scroll-view class="flex-sub" scroll-y="true"><view></view></scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			signature: ''
		};
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
	.textarea {
		padding: 20rpx;
		background-color: white;
	}
}
</style>
