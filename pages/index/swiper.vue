<template>
	<view class="">
		<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item class="swiper-item" v-for="(banner, index) in bannerList" :key="banner">
				<image class="banner-image" :src="banner.url" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	props: {
		bannerList: {
			type: Array,
			default: () => []
		},
		indicatorDots: {
			type: Boolean,
			default: true
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number | String,
			default: 3000
		},
		duration: {
			type: Number | String,
			default: 1000
		}
	}
};
</script>

<style scoped lang="scss">
.swiper {
	/* height: 100%; */
	// width: 100vw;
	width: 90vw;
	margin-left: 5vw;
	.swiper-item {
		margin-top: 5vw;
		display: grid;
		place-items: center;
		border-radius: 10rpx;
		overflow: hidden;
		height: 100%;
		.banner-image {
			height: 100%;
			width: 100%;
		}
	}
}
</style>
