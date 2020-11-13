<template>
	<view class="wapper">
		<view class="label">超过100人申请，且平台审核后，即可新增此话题</view>
		<view class="value"><input style="width: 100%;" v-model="topic" type="text" placeholder="填写话题" /></view>
		<button class="sumbit" @click="handle_sumbit">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topic: ''
			};
		},
		methods: {
			async handle_sumbit() {
				if (!this.topic) {
					this.$showToast('请输入话题！');
					return;
				}
				const {
					code,
					message
				} = await this.$store.dispatch('topic/addTopic', {
					name: 'topic',
					data: {
						action: 'add',
						name: `#${this.topic}#`
					}
				});
				this.$showToast(message)
				uni.navigateBack();
			}
		},
	}
</script>

<style lang="scss">
	.wapper,
	page {
		min-height: 100vh;
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
