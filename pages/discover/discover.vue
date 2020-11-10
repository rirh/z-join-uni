<template>
	<view class="wapper">
		<scroll-view class="scrollviwe" :scroll-y="true">
			<skeleton :row="rowComputed" animate :loading="loading">
				<view class="card" v-for="(item, index) in letters" @click="handle_to_record(item)" :key="index">
					<view class="header">
						<image class="avatar" :src="item.avatar|| `/static/headimg-${user.gender?'male':'female'}.svg`" mode="scaleToFill"></image>
						<text class="flex-sub">{{item.author}}</text>
					</view>
					<view class="contant">
						<view class="">
							<text  user-select>{{item.desc}}</text>

						</view>

					</view>
				</view>
				<load-more :status="moreStatus" />
			</skeleton>
		</scroll-view>
	</view>
</template>

<script>
	import moment from 'moment';
	import skeleton from "components/skeleton/skeleton.vue";
	import loadMore from "components/uni-load-more/uni-load-more.vue";
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
	import {
		mapGetters
	} from "vuex";
	export default {
		components: {
			skeleton,
			loadMore
		},
		data() {
			return {
				list,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				letters: [],
				moreStatus: "loading",
				page: 0,
				pageSize: 15,
				loading: true
			}
		},
		computed: {
			...mapGetters({
				user: "auth/user",
				storeletters: "discover/letters",
			}),
			rowComputed() {
				return uni.getSystemInfoSync().windowHeight / 30
			},
		},
		onLoad() {
			const user = uni.getStorageSync('uniIdToken');
			if (!user) {
				uni.navigateTo({
					url: '/pages/auth/login/login'
				});
			}
		},
		onLoad() {
			this.init()

		},
		onShow() {
			this.page = 0;
			this.letters = [];
			this.fetchLetters()
		},
		methods: {
			init() {
				this.page = 0;
				this.letters = [];
				this.loading = true
				this.fetchLetters()
				this.loading = false;
			},
			async fetchLetters() {
				const payload = {
					name: "letter",
					data: {
						action: "query",
						page: this.page,
						pageSize: this.pageSize
					},
				};
				this.moreStatus = "loading";
				const result = await this.$store.dispatch('discover/fetchLetters', payload);
				const {
					data,
					total
				} = this.storeletters;
				this.letters = [...this.letters, ...data];
				this.moreStatus = this.letters.length + (this.page * this.pageSize) < total ? 'more' : 'noMore';
				this.loading = false;
			},
			handle_to_record(item) {
				this.$store.commit('home/updateCurrentLetter', item)
				uni.navigateTo({
					url: '/pages/index/record/record'
				})
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
		height: 100vh;
		background-color: #eee;
		overflow: hidden;
		/* #ifndef APP-PLUS */
		// padding-top: 30rpx;
		// padding-top: var(--status-bar-height);

		/* #endif */
		.scrollviwe {
			height: 100%;
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
			}

		}
	}


	.icon {
		height: 45rpx;
		width: 45rpx;
	}
</style>
