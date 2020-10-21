<template>
	<view class="container">
		<view class="audio" @click="handle_toggle_audio">
			<text class="bg" :class="[duration&&(paused?'voicePlay paused':'voicePlay')||'']" style="margin-left: 20rpx;"></text><text
			 style="margin-left: 20rpx;">{{duration||'00'}}''</text>
		</view>
		<view class="context">
			<text>{{letter}}</text>
		</view>
		<!-- <rich-text class="context" :nodes="letter">
		</rich-text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paused: true,
				url: '',
				currentTime: '',
				duration: '',
				innerAudioContext: {},
				letter: '',
			};
		},
		onShow() {
			this.fetch_audio_url()
			this.fetch_letter_context();
		},
		watch: {

			url(msg) {
				if (msg)
					this.init_audio_context()
			}
		},
		methods: {
			fetch_letter_context() {
				uniCloud.callFunction({
					name: 'letter',
					data: {
						type: 'letterContext'
					},
					success: ({
						result: {
							data
						}
					}) => {
						this.letter = data
					}
				})
			},
			handle_toggle_audio() {
				const innerAudioContext = this.innerAudioContext;
				if (innerAudioContext.paused) {
					this.paused = false;
					innerAudioContext.play()
				} else {
					this.paused = true;
					innerAudioContext.pause()
				}

			},
			/**
			 * 
			 */
			init_audio_context() {
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.src = this.url;
				console.log('初始化成功', this.innerAudioContext);
				this.innerAudioContext.onTimeUpdate((p) => {
					this.currentTime = Math.floor(this.innerAudioContext.currentTime);
					this.duration = Math.floor(this.innerAudioContext.duration);
				})
				this.innerAudioContext.onEnded(() => {
					this.paused = true
				})
				this.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
			/**
			 * 
			 */
			fetch_audio_url() {
				uniCloud.callFunction({
					name: 'res',
					data: {
						url: '/read_card_by_me.mp3'
					},
					success: ({
						result
					}) => {
						console.log(this.url);
						this.url = result
						console.log(this.url);
					}
				})
			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #eee;
		height: 100%;
		width: 100vw;
		overflow: hidden;

		.container {
			background-color: #f6f6f6;
			margin: 3vh 6vw;
			height: min-content;
			min-height: 100vh;
			display: flex;
			align-items: center;
			flex-direction: column;

			.audio {
				height: 90rpx;
				width: 90%;
				margin-top: 40rpx;
				background-color: #fff;
				display: flex;
				align-items: center;
				border-radius: 10rpx;

			}

			.audio:active {
				background-color: #f6f6f6;
			}

			.context {
				// text-decoration: underline;
				width: 90%;
				margin-top: 40rpx;
				word-break: break-all;
				letter-spacing: 3rpx;
				color: #333;
				font-size: 34rpx;

				text {
					line-height: 50rpx;
					font-weight: 500;
					color: #333;
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
		background: url('/static/audio.svg') right 0 no-repeat;
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
