<template>
	<view class="content">
		<view class="">{{ timer.iso }}</view>
		<view class="">{{ timer.epoch }}</view>
	</view>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			timer: {}
		};
	},
	onLoad() {
		uniCloud.callFunction({
			name: 'iso',
			success: ({ result }) => {
				this.timer = result;
			}
		});
	},
	methods: {}
};
</script>

<style>
.content {
	display: grid;
	place-items: center;
	font-size: 32rpx;
	margin: 5vw;
	color: #333;
}
</style>
