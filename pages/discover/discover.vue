<template>
	<view class="wapper">

		<skeleton :row="rowComputed" animate :loading="loading">
			<view class="card" v-for="(item, index) in letters" @click="handle_to_record(item)" :key="index">
				<view class="header">
					<image class="avatar" :src="item.avatar||item.avatarUrl || `/static/headimg-${user.gender ? 'male' : 'female'}.svg`"
					 mode="scaleToFill"></image>
					<text class="flex-sub">{{ item.author }}</text>
				</view>
				<view class="contant">
					<view v-if="item.audioPath" @click.stop="handle_current_audio(item,index)" class="audio">
						<text user-select class="bg" :class="[(item.duration && (item.paused ? 'voicePlay paused' : 'voicePlay')) || '']"
						 style="margin-left: 20rpx;"></text>
						<text style="margin-left: 20rpx;">{{ item.duration || '00' }}''</text>
					</view>
					<view class="desc">
						<text user-select>{{ item.desc }}</text>
					</view>
					<view class="extr">
						<view class="extr-info" v-if="item.loction && JSON.parse(item.loction).name">
							<view class="tag" @click.stop="handleOpenLoction(item.loction)">
								<image class="loc" src="/static/loction-white.svg" mode="scaleToFill"></image>
								<text class="loc-name">{{ JSON.parse(item.loction).name }}</text>
							</view>
						</view>
						<view class="time">
							{{moment(item.createtime).format('YYYY-MM-DD hh:mm')}}
						</view>
					</view>
				</view>
			</view>
			<load-more :status="moreStatus" />
		</skeleton>
	</view>
</template>

<script>
	import moment from 'moment';
	import skeleton from 'components/skeleton/skeleton.vue';
	import loadMore from 'components/uni-load-more/uni-load-more.vue';
	const innerAudioContext = uni.createInnerAudioContext();

	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			skeleton,
			loadMore
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				letters: [],
				moreStatus: 'loading',
				page: 1,
				pageSize: 15,
				loading: true,
				paused: true,
				duration: ''
			};
		},
		computed: {
			...mapGetters({
				user: 'auth/user',
				storeletters: 'discover/letters'
			}),
			rowComputed() {
				return uni.getSystemInfoSync().windowHeight / 30;
			}
		},

		onShow() {

			const user = uni.getStorageSync('uniIdToken');
			if (!user) {
				uni.navigateTo({
					url: '/pages/auth/login/login'
				});
			}
			if (!this.letters.length) {
				this.loading = true;
				this.fetchLetters();
				innerAudioContext.onTimeUpdate(p => {
					this.duration = Math.floor(innerAudioContext.duration);
				});
				innerAudioContext.onEnded(() => {
					this.paused = true;
				});
				innerAudioContext.onError(res => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			}
		},
		onPullDownRefresh() {
			this.loading = true;
			this.page = 0;
			this.fetchLetters();
		},
		onReachBottom() {
			if (this.moreStatus === 'noMore') return;
			this.page = this.page + 1;
			this.fetchLetters();
		},
		methods: {
			moment,

			init() {
				this.page = 0;
				this.letters = [];
				this.loading = true;
				this.fetchLetters();
				this.loading = false;
			},
			async fetchLetters() {
				const payload = {
					name: 'letter',
					data: {
						action: 'query',
						page: this.page,
						pageSize: this.pageSize
					}
				};
				this.moreStatus = 'loading';
				const result = await this.$store.dispatch('discover/fetchLetters', payload);
				const {
					data,
					total
				} = this.storeletters;
				this.letters = this.page > 0 ? [...this.letters, ...data] : data;
				this.moreStatus = this.letters.length + this.page * this.pageSize > total ? 'noMore' : 'more';
				this.loading = false;
				uni.stopPullDownRefresh();
			},
			handleOpenLoction(loc) {
				const {
					latitude,
					longitude
				} = JSON.parse(loc);
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function() {
						console.log('success');
					}
				});
			},
			handle_current_audio({
				audioPath,
				paused,
				duration
			}, index) {
				if (innerAudioContext.src === audioPath) {
					if (paused) {
						innerAudioContext.play()
						this.letters[index].paused = false;
					} else {
						innerAudioContext.pause()
						this.letters[index].paused = true;

					}
				} else {
					innerAudioContext.pause()
					innerAudioContext.src = audioPath;
					innerAudioContext.play()
					this.letters[index].paused = false;
				}
			},
			handle_to_record(item) {
				this.$store.commit('home/updateCurrentLetter', item);
				uni.navigateTo({
					url: '/pages/index/record/record'
				});
			},
			handle_thumb(i) {
				const t = this.list[i].thumbs.length;
				if (t) {
					this.list[i].thumbs = [];
				} else {
					this.list[i].thumbs = [{
						nice: 'xxx'
					}];
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	page,
	.wapper {
		background-color: #eee;
		min-height: 100vh;



		.scrollviwe {
			// height: 100%;
		}

		// padding-top:30rpx ;
		.card {
			border-radius: 20rpx;
			background-color: #fff;
			box-shadow: 0rpx 3rpx 3rpx -2rpx rgba(0, 0, 0, 0.2), 0rpx 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.14), 0rpx 1rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
			padding: 20rpx 30rpx;
			margin: 20rpx 30rpx;
			font-size: 32rpx;
			color: #333;

			.header {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #666;

				.avatar {
					height: 60rpx;
					width: 60rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}

			.contant {
				padding: 20rpx;

				.desc {
					font-size: 28rpx;
					color: #555;
				}

				.audio {
					height: 90rpx;
					width: 100%;
					margin: 20rpx 0;
					cursor: pointer;
					background-color: #eee;
					display: flex;
					align-items: center;
					border-radius: 10rpx;
				}

				.extr {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 24rpx;
					color: #666;
					margin-top: 15rpx;

				}

				.extr-info {
					margin: 10rpx 0;
					display: flex;
					margin-right: 10rpx;

					.tag {
						display: flex;
						align-items: center;
						font-size: 22rpx;
						color: #fff;
						background-color: #000;
						border-radius: 10rpx;
						padding: 2rpx 15rpx;
					}

					.loc {
						margin-right: 8rpx;
						height: 30rpx;
						width: 30rpx;
						padding-bottom: 4rpx;
					}

					.loc-name {
						line-height: 22px;
					}
				}

				.audio:active {
					background-color: #eeeeee;
				}
			}
		}
	}

	.paused {
		animation-play-state: paused;
		-webkit-animation-play-state: paused;
		/* Safari 和 Chrome */
	}

	.bg {
		background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiAyNCIgd2lkdGg9Ijk2IiBoZWlnaHQ9IjI0Ij4KCTxkZWZzPgoJCTxpbWFnZSB3aWR0aD0iODgiIGhlaWdodD0iMjQiIGlkPSJpbWcxIiBocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUZnQUFBQVlCQU1BQUFDTTR5ZHJBQUFBQVhOU1IwSUIyY2tzZndBQUFCNVFURlJGLy8vLy8vLy9BQUFBLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL0g0MlJ4UUFBQUFwMFVrNVRBQUgvQWdZRENBY0ZCUDRYakI4QUFBQzlTVVJCVkhpY3RaUE5FUUl4Q0lXVDlXZkdHM2FRb1FKTHNRUkwyQklzWGRaazRSRVNSdzl5eUh3d0JIaHNOcVhPQ0pqTG1OVnVtTXhqSGhwRE9ZNmx1OFphRGpubGNlT0ZCNnk2SkpoZGNvbXN1aUR5NXQxdDNGeXl5UWltckdNcHh5a0p1Q1h2M0RWV0daV3JhK3kzSmZFTTNPNHEvelA1OEhXeW5FY3ZNTThGeWtKT2ZuWFgrZXBrNUlkTnNVWFcrVWRaN0RFSWIxdC9BbGYxeUdCeSswekdrNGRrQ1JldklETHNMdDI5Z3NoZ0diaC9zQi90dHgrMmVINEJWeW9reXZ5c0Rua0FBQUFBU1VWT1JLNUNZSUk9Ii8+Cgk8L2RlZnM+Cgk8c3R5bGU+CgkJdHNwYW4geyB3aGl0ZS1zcGFjZTpwcmUgfQoJPC9zdHlsZT4KCTx1c2UgaWQ9IkJhY2tncm91bmQiIGhyZWY9IiNpbWcxIiB4PSI0IiB5PSIwIiAvPgo8L3N2Zz4=') right 0 no-repeat;
		width: 24px;
		height: 24px;
		background-size: 400%;
	}

	.voicePlay {
		animation-name: voicePlay;
		animation-duration: 1s;
		animation-direction: normal;
		animation-iteration-count: infinite;
		animation-timing-function: steps(3);
	}

	.icon {
		height: 45rpx;
		width: 45rpx;
	}

	@keyframes voicePlay {
		0% {
			background-position: 0;
		}

		100% {
			background-position: 100%;
		}
	}
</style>
