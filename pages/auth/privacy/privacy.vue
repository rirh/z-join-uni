<template>
	<view class="protocol">
		<text  user-select >{{ nodes }}</text>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nodes: ''
		};
	},
	async onLoad() {
		uni.showLoading()
		const {
			result: { code, data }
		} = await uniCloud.callFunction({
			name: 'protocol',
			data: {
				params: {
					type: 'privacy'
				}
			}
		});
		uni.hideLoading()
		if (!code) {
			this.nodes = data;
		}
	},
	methods: {}
};
</script>

<style lang="scss">
.protocol {
	padding: 36rpx;
	font-size: 28rpx;
	color: #333;
}
</style>
