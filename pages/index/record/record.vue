<template>
	<view class="wapper">
		<view>
			<input type="text" v-model="fromAuth" placeholder="请输入收件人" />
		</view>
		<view v-if="voicePath" class="audio" @click="handle_toggle_audio">
			<text class="bg" :class="[duration&&(paused?'voicePlay paused':'voicePlay')||'']" style="margin-left: 20rpx;"></text>
			<text style="margin-left: 20rpx;">{{duration||'00'}}''</text>
		</view>
		<view class="contant">
			<skeleton :row="8"  animate :loading="!letter">
				<text>{{letter}}</text>
			</skeleton>
		</view>
		<view class="record">
			<view class="record-btn" @click="handle_start_record">
				<text :class="{'record-red':true,'recording':recording}"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import skeleton from 'components/skeleton/skeleton.vue'
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		components: {
			skeleton
		},
		data() {
			return {
				voicePath: '',
				fromAuth: '',
				recording: false,
				duration: '',
				paused: true,
				letter: '',
			};
		},
		onLoad() {
			this.fetchLetter()
			recorderManager.onStop((res) => {
				console.log('recorder stop' + JSON.stringify(res));
				this.voicePath = res.tempFilePath;
			});
		},
		watch: {
			voicePath(newValue, oldValue) {
				if (newValue !== oldValue)
					this.initAudioContent()
			}
		},
		methods: {
			initAudioContent() {
				innerAudioContext.src = this.voicePath;
				innerAudioContext.onTimeUpdate((p) => {
					this.duration = Math.floor(innerAudioContext.duration);
				})
				innerAudioContext.onEnded(() => {
					this.paused = true
				})
				innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
			handle_toggle_audio() {
				if (innerAudioContext.paused) {
					this.paused = false;
					innerAudioContext.play()
				} else {
					this.paused = true;
					innerAudioContext.pause()
				}
			},
			async fetchLetter() {
				this.$http({
					name: 'letter',
					data: {
						type: 'meetYou'
					}
				}).then(({
					data
				}) => {
					const [{
						desc
					}] = data
					this.letter = desc;
				})
			},

			handle_start_record() {
				if (this.recording) {
					this.endRecord()
				} else {
					this.startRecord();
				}
			},
			startRecord() {
				recorderManager.start();
				this.recording = true;
			},
			endRecord() {
				recorderManager.stop();
				this.recording = false;
			},
		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #eee;
		overflow: hidden;
		height: 100vh;
		width: 100vw;

		.wapper {
			margin: 60rpx 40rpx;
			background-color: white;
			border-radius: 10rpx;
			box-shadow: 0 -1rpx 6rpx rgba(0, 0, 0, 0.1);
			height: 120vh;
			min-width: min-content;
			padding: 40rpx;


			.contant {
				margin: 20rpx 0;
				letter-spacing: 1rpx;
				word-break: break-all;
				line-height: 48rpx;
				color: #333;
				text-decoration: blink;
			}
		}

		.audio {
			height: 90rpx;
			width: 100%;
			margin: 20rpx 0;
			background-color: #eee;
			display: flex;
			align-items: center;
			border-radius: 10rpx;
		}

		.audio:active {
			background-color: #f6f6f6;
		}



		.record {
			display: grid;
			place-items: center;
			margin-top: 6vw;

			.record-btn {
				height: 13vw;
				width: 13vw;
				background-color: #999999;
				border-radius: 50%;
				position: relative;
				border: 5rpx solid #999;
				display: grid;
				place-items: center;
			}

			.record-btn:after {
				position: absolute;
				content: ' ';
				left: .5vw;
				top: .5vw;
				height: 12vw;
				width: 12vw;
				border-radius: 50%;
				background-color: white
			}

			.record-red {
				height: 80%;
				width: 80%;
				background-color: red;
				z-index: 1;
				position: relative;
				display: block;
				border-radius: 50%;
				transition: border-radius .3s, height .3s, width .3s;
			}

			.recording {
				border-radius: 10rpx;
				height: 60%;
				width: 60%;
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

	@keyframes voicePlay {
		0% {
			background-position: 0;
		}

		100% {
			background-position: 100%;
		}
	}
</style>
