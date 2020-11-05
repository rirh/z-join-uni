<template>
	<view class="body">
		<view class="wapper">
			<view class="auth-wapper"><input class="flex-sub" type="text" v-model="toAuth" placeholder="请输入收件人" />
				<button @click="handle_public" :loading="loading" class="btn" v-if="voicePath">
					<image class="icon" src="/static/send.svg" mode="scaleToFill"></image>
					发布
				</button>
			</view>
			<view v-if="voicePath" class="audio" @click="handle_toggle_audio">
				<text selectable class="bg" :class="[(duration && (paused ? 'voicePlay paused' : 'voicePlay')) || '']" style="margin-left: 20rpx;"></text>
				<text style="margin-left: 20rpx;">{{ duration || '00' }}''</text>
			</view>
			<view class="contant">
				<skeleton :row="8" animate :loading="!letter.desc">
					<text>
						{{ letter.desc }}
					</text>
				</skeleton>
			</view>
			<view :class="{ 'record': true, 'record-wave': recording }">
				<view class="record-btn" @click="handle_start_record"><text :class="{ 'record-red': true, recording: recording }"></text></view>
			</view>
			<view class="sub-wapper" v-if="voicePath">
				<button @click="handlle_re_record" class="btn re-record">
					<image class="icon" src="/static/backup-restore.svg" mode="scaleToFill"></image>
					重录
				</button>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import skeleton from 'components/skeleton/skeleton.vue';
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		components: {
			skeleton
		},
		computed: {
			...mapGetters({
				user: "auth/user",
				letter: 'home/currentletter'
			}),
		},
		data() {
			return {
				voicePath: '',
				toAuth: '',
				recording: false,
				duration: '',
				paused: true,
				loading: false,
			};
		},
		onLoad() {
			// this.fetchLetter();
			recorderManager.onStop(res => {
				console.log('recorder stop' + JSON.stringify(res));
				this.voicePath = res.tempFilePath;
			});
		},
		watch: {
			voicePath(newValue, oldValue) {
				if (newValue !== oldValue) this.initAudioContent();
			}
		},
		methods: {

			initAudioContent() {
				innerAudioContext.src = this.voicePath;
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
			},
			async handle_public() {
				if (this.loading) return;
				this.loading = true
				const url = await this.$store.dispatch('home/updateAudio', this.voicePath);
				const user = this.user;
				const result = await this.$store.dispatch("home/insterLetter", {
					author: user.nickName,
					catagory: [],
					contant: "",
					createtime: Date.now(),
					desc: this.letter.desc,
					loction: this.letter.loction || '{}',
					uid: user._id,
					avatar: user.avatar,
					audioPath: url,
					to: this.toAuth,
					_id: user._id
				});
				this.loading = false;
				this.$showToast('发布成功')
				uni.navigateBack();

			},
			handle_toggle_audio() {
				if (innerAudioContext.paused) {
					this.paused = false;
					innerAudioContext.play();
				} else {
					this.paused = true;
					innerAudioContext.pause();
				}
			},
			handlle_re_record() {
				this.voicePath = '';
				this.handle_start_record()
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
					const [letter] = data;
					this.letter = letter;
				});
			},

			handle_start_record() {
				if (this.recording) {
					this.endRecord();
				} else {
					this.startRecord();
				}
			},
			startRecord() {
				recorderManager.start({
					duration: 600000,
					format: 'mp3',
					encodeBitRate: 320000,
					sampleRate: 44100,
					numberOfChannels: 2

				});
				this.recording = true;
			},
			endRecord() {
				recorderManager.stop();
				this.recording = false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	page,
	.body {
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

			.auth-wapper {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.contant {
				margin: 20rpx 0;
				letter-spacing: 1rpx;
				word-break: break-all;
				line-height: 48rpx;
				color: #333;
				text-decoration: blink;
				min-height: 40vh;
				max-height: 50vh;
				overflow: scroll;
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
			margin-top: 8vh;

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
				left: 0.5vw;
				top: 0.5vw;
				height: 12vw;
				width: 12vw;
				border-radius: 50%;
				background-color: white;
			}

			.record-red {
				height: 80%;
				width: 80%;
				background-color: red;
				z-index: 1;
				position: relative;
				display: block;
				border-radius: 50%;
				transition: border-radius 0.3s, height 0.3s, width 0.3s;
			}

			.recording {
				border-radius: 10rpx;
				height: 60%;
				width: 60%;
			}
		}

		.sub-wapper {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-top: 3vh;

			.re-record {
				height: 90rpx;
				width: 80vw;
				font-size: 28rpx;

				>image {
					height: 40rpx;
					width: 40rpx;

				}

				// font-size: 32rpx;
			}

		}

	}

	.btn {
		background-color: #000;
		color: #fff;
		font-size: 24rpx;
	}

	.icon {
		height: 30rpx;
		width: 30rpx;
		margin-right: 20rpx;
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

	.record-wave {
		position: relative;
	}

	.record-wave:after {
		content: ' ';
		position: absolute;
		height: 13vw;
		width: 13vw;
		background-color: #999999;
		border-radius: 50%;
		border: 5rpx solid #999;
		animation: wave 1s infinite linear;
		-webkit-animation: wave 1s infinite linear alternate, reverse, normal;

	}


	@keyframes wave {
		0% {
			height: 14vw;
			width: 14vw;
			opacity: .9;
			background-color: #d8d8d8;
		}

		50% {
			height: 16vw;
			width: 16vw;
			opacity: .6;
			background-color: #eee;

		}

		100% {
			height: 19vw;
			width: 19vw;
			opacity: .2;
			background-color: #f4f4f4;
		}

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
