<template>
	<view>
		<view class="loading" :style="{width:`${loading}vw`,display:`${loading>0?'block':'none'}`}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: 0,
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.loading {
		height: 1rpx;
		background-color: #6C63FF;
		z-index: 1;
	}
</style>
