<template>
	<view>
		<view class="title">
			<view class="" v-if="integral>0">
				<text v-for="item in integral" :key='item'>🥕</text> &nbsp; x {{integral}}
			</view>
			<view class="" v-else>
				分享👇 获得🥕
			</view>
		</view>
		<textScroll v-if="iswork" :text="tips"></textScroll>
		<view class="" v-if="integral<=0">
			<!-- #ifdef MP-WEIXIN -->
			<button type="default" open-type="share" :disabled="integral>0" @click="handle_buy">获得🥕</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<button type="default" :disabled="integral>0" @click="handle_buy">购买🥕</button>
			<!-- #endif -->
		</view>
		<view class="">
			<button type="default" :disabled="model===1||integral<=0" @click="handle_do_1">小狐狸🦊缓慢按摩服务</button>
		</view>
		<view class="">
			<button type="default" :disabled="model===2||integral<=0" @click="handle_do_2">小狐狸🦊快速按摩服务</button>
		</view>
		<view class="">
			<button type="default" :disabled="model===3||integral<=0" @click="handle_do_3">小兔子🐰缓慢按摩服务</button>
		</view>
		<view class="">
			<button type="default" :disabled="model===4||integral<=0" @click="handle_do_4">小兔子🐰快速按摩服务</button>
		</view>
		<view class="">
			<button type="default" :disabled="model===5||integral<=0" @click="handle_do_5">小狐狸🦊、小兔子🐰和小公主👸一起高级按摩服务</button>
		</view>
		<view class="">
			<button type="default" :disabled="model===6||integral<=0" @click="handle_do_6">小狐狸🦊、小兔子🐰和小公主👸一起帝王按摩服务</button>
		</view>
		<view class="">
			<button type="default" @click="handle_stop">贤者时间</button>
		</view>
	</view>
</template>

<script>
	import textScroll from './scroll-text.vue'

	function gen_random(min, max) {
		return parseInt(Math.random() * (max - min + 1) + min, 10)
	}
	export default {
		components: {
			textScroll
		},
		data() {
			return {
				integral: 0,
				iswork: false,
				model: -1,
				timer: {},
				tips: '如果说你是海上的烟火，我是浪货的泡沫，如果说你是海上的烟火，我是浪货的泡沫如果说你是海上的烟火，我是浪货的泡沫',
				stop_tips_array: [
					'记得多喝点水哦～',
					'你也想吃胡萝卜么？',
					'记住刚刚的美好的时光',
					'One more time ?',
					'营养要跟上嗷',
					'我贤者我自己～',
					'oh，就是刚刚！美好时光！'
				]

			}
		},
		onShow() {
			this.integral = uni.getStorageSync("carrot");
		},
		onShareAppMessage: function(options) {
			return {
				title: '【🐰 SPA】领取🥕 吧！',
				path: '/pages/index/index',
			}
		},
		methods: {
			handle_start() {
				let duration;
				let type = 'vibrateLong';
				switch (this.model) {
					case 1:
						duration = gen_random(1000, 3000)
						type = 'vibrateLong';
						break;
					case 2:
						duration = gen_random(1000, 2000)
						type = 'vibrateLong';
						break;
					case 3:
						duration = 1000
						type = 'vibrateShort';
						break;
					case 4:
						duration = 500
						type = 'vibrateShort';
						break;
					case 5:
						duration = 300
						type = Math.random() >= 0.5 ? 'vibrateLong' : 'vibrateShort';
						break;
					case 6:
						duration = 100
						type = Math.random() >= 0.5 ? 'vibrateLong' : 'vibrateShort';
						break;
					default:
						break;
				}
				this.timer = setTimeout(() => {
					uni[type]({
						success: () => {
							if (this.iswork) this.handle_start()
						}
					})
				}, duration)
			},


			handle_do_1() {
				clearTimeout(this.timer)
				this.iswork = false;
				this.model = 1;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();
				this.handle_start()
			},
			handle_do_2() {
				clearTimeout(this.timer)
				this.iswork = false;
				this.model = 2;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();
				this.handle_start()


			},
			handle_do_3() {
				clearTimeout(this.timer)

				this.iswork = false;

				this.model = 3;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();

				this.handle_start()

			},
			handle_do_4() {
				clearTimeout(this.timer)

				this.iswork = false;

				this.model = 4;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();

				this.handle_start()

			},
			handle_do_5() {
				clearTimeout(this.timer)

				this.iswork = false;

				this.model = 5;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();

				this.handle_start()

			},
			handle_do_6() {
				clearTimeout(this.timer)

				this.iswork = false;
				this.model = 6;
				this.integral -= 1;
				this.iswork = true;
				this.handle_tips();
				this.handle_start()

			},
			handle_stop() {
				this.iswork = false;
				this.model = -1;
				clearTimeout(this.timer)
				const tips = this.stop_tips_array[gen_random(0, this.stop_tips_array.length - 1)]
				uni.showToast({
					duration: 2000,
					title: tips,
					icon: 'none'
				})
			},
			handle_tips() {
				uni.showToast({
					duration: 2000,
					title: '🥕 -1',
					icon: 'none'
				})
			},
			handle_buy() {
				console.log('打开广告源');

			}
		}
	}
</script>

<style>
	.title {
		padding-top: var(--status-bar-height);
		height: 90px;
		line-height: 90px;
		box-sizing: border-box;
		padding-left: 20px;
	}

	button {
		margin: 10rpx;
	}
</style>
