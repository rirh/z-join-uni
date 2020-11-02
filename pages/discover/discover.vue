<template>
	<view class="wapper" :style="{'padding-top':CustomBar+'rpx'}">
		<view class=" card" v-for="(item, index) in list" :key="index">
			<view class="">
				<text>{{ item.contant }}</text>
			</view>
			<view class="createtime">
				<view class="">
					<text>{{ item.createtime }}</text>
				</view>
				<view class="action">
					<image class="icon" @click="handle_thumb(index)" style="margin-right: 15rpx;" :src="item.thumbs.length ? '/static/thumbsd.svg' : '/static/thumbs.svg'"
					 mode="scaleToFill"></image>
					<image class="icon" src="/static/comment.svg" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="thumbs" v-if="item.thumbs.length">
				<image style="margin-right: 10rpx;" :src="'/static/thumbsd.svg'" mode="scaleToFill"></image>
				<text v-for="(thumb, ti) in item.thumbs" :key="ti">{{ thumb.nice }}</text>
				觉得很赞
			</view>
			<view class="comment" v-if="item.comment.length">
				<view v-for="(comment, ci) in item.comment" :key="ci">
					<text>{{ comment.nick }}:</text>
					<text>{{ comment.contant }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	const list = [{
			id: 1,
			contant: '荒木经惟 东京日和',
			createtime: '2020-07-12 13:14',
			thumbs: [{
				nice: 'xxx'
			}],
			comment: [{
				nick: '何伯',
				contant: '赞'
			}]
		},
		{
			id: 2,
			contant: '开开心心',
			createtime: '2020-07-12 13:14',
			thumbs: [],
			comment: [{
				nick: '何伯',
				contant: '赞'
			}]
		},
		{
			id: 3,
			contant: '快快乐乐',
			createtime: '2020-07-12 13:14',
			thumbs: [],
			comment: [{
				nick: '何伯',
				contant: '赞'
			}]
		}
	];

	export default {
		data() {
			return {
				list,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		onLoad() {
			const user = uni.getStorageSync('uniIdToken');
			if (!user) {
				uni.navigateTo({
					url: '/pages/auth/login/login'
				});
			}
		},
		onLoad() {},
		methods: {
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
		height: 100vh;
		background-color: #eee;
		/* #ifndef APP-PLUS */
		// padding-top: 30rpx;
		// padding-top: var(--status-bar-height);

		/* #endif */
		// padding-top:30rpx ;
		.card {
			border-radius: 20rpx;
			background-color: #fff;
			box-shadow: 0rpx 3rpx 3rpx -2rpx rgba(0, 0, 0, 0.2), 0rpx 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.14), 0rpx 1rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
			padding: 30rpx 40rpx;
			margin: 20rpx 30rpx;
			font-size: 32rpx;
			color: #333;

			.createtime {
				margin-top: 50rpx;
				font-size: 24rpx;
				color: #999;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.thumbs {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 24rpx;
				color: #666;
				margin-top: 5rpx;

				image {
					height: 40rpx;
					width: 40rpx;
				}
			}

			.comment {
				font-size: 24rpx;
				margin-top: 10rpx;
			}
		}
	}


	.icon {
		height: 45rpx;
		width: 45rpx;
	}
</style>
