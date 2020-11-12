<template>
	<view class="wapper">
		<nav-bar background-color="#eee" title="我的个性签名" :shadow="false" :border="false">
			<navigator url="/pages/me/edit-signature/edit-signature" slot="left">
				<image class="icon-edit" src="/static/edit.svg" mode="scaleToFill" @click="handle_go_edit"></image>
			</navigator>
		</nav-bar>
		<view class="content-info">
			<image class="avatar" :src="user.avatarUrl || `/static/headimg-${user.gender ? 'male' : 'female'}.svg`" mode="scaleToFill"></image>
			<view class="">
				<view class="name">
					<text user-select>{{ user.nickName }}</text>
				</view>
				<view class="count">
					<text user-select>累计发表{{ letters.length }}条个性签名</text>
				</view>
			</view>
		</view>
		<view class="contant">
			<view class="latter-wapper">
				<skeleton :row="rowComputed" animate :loading="loading">
					<view v-if="letters.length">
						<view class="letter" @click="handle_go_edit(letter)" v-for="(letter, index) in letters" :key="index">
							<view class="">
								<text user-select>{{ letter.desc }}</text>
							</view>
							<view class="extr-info" v-if="letter.loction && JSON.parse(letter.loction).name">
								<view class="tag" @click.stop="handleOpenLoction(letter.loction)">
									<image class="loc" src="/static/loction-white.svg" mode="scaleToFill"></image>
									<text class="loc-name">{{ JSON.parse(letter.loction).name }}</text>
								</view>
							</view>
						</view>
						<load-more v-show="letters.length > 8" :status="moreStatus" />
					</view>
					<zEmpty v-else />
				</skeleton>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog"><view class="auth-pop">开始创作我的个性签名。</view></uni-popup>
	</view>
</template>
<script>
import banner from './swiper.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import navBar from 'components/uni-nav-bar/uni-nav-bar.vue';
import skeleton from 'components/skeleton/skeleton.vue';
import loadMore from 'components/uni-load-more/uni-load-more.vue';
import uniPopup from 'components/uni-popup/uni-popup.vue';
import zEmpty from 'components/z-empty/z-empty.vue';
export default {
	components: {
		navBar,
		banner,
		skeleton,
		loadMore,
		uniPopup,
		zEmpty
	},
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			letters: [],
			moreStatus: 'loading',
			page: 0,
			pageSize: 15,
			loading: true
		};
	},
	computed: {
		...mapGetters({
			isLogin: 'auth/isLogin',
			user: 'auth/user',
			storeletters: 'home/letters'
		}),
		rowComputed() {
			return uni.getSystemInfoSync().windowHeight / 40;
		}
	},

	onLoad() {
		if (!this.isLogin) {
			uni.navigateTo({
				url: '/pages/auth/login/login'
			});
		}
		// this.$refs.popup.open()
	},
	onShow() {
		if (!this.letters.length) {
			this.loading = true;
			this.init();
		}
	},
	onPullDownRefresh() {
		this.loading = true;
		this.init();
	},
	methods: {
		async init() {
			this.page = 0;
			this.letters = [];
			await this.fetchLetters();
			uni.stopPullDownRefresh();
		},
		async fetchLetters() {
			const uid = uni.getStorageSync('uid');
			const payload = {
				name: 'letter',
				data: {
					action: 'query',
					uid: uid,
					page: this.page,
					pageSize: this.pageSize
				}
			};
			this.moreStatus = 'loading';
			await this.$store.dispatch('home/fetchLetters', payload);
			const { data, total } = this.storeletters.data;
			this.letters = [...this.letters, ...data];
			this.moreStatus = this.letters.length + this.page * this.pageSize < total ? 'more' : 'noMore';
			this.loading = false;
		},
		handleOpenLoction(loc) {
			const { latitude, longitude } = JSON.parse(loc);
			uni.openLocation({
				latitude: latitude,
				longitude: longitude,
				success: function() {
					console.log('success');
				}
			});
		},
		fetchMoreLetters() {
			if (this.moreStatus === 'noMore') return;
			this.page = this.page + 1;
			this.fetchLetters();
		},
		handle_go_edit(item) {
			this.$store.commit('home/updateCurrentLetter', item);
			uni.navigateTo({
				url: '/pages/index/record/record'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page,
.wapper {
	background-color: #eee;
	min-height: 100vh;
	width: 100vw;
	// overflow: hidden;
	display: flex;
	flex-direction: column;

	navigator:active {
		background-color: #eee;
	}

	.icon-edit {
		height: 40rpx;
		width: 40rpx;
		margin-left: 30rpx;
	}

	.content-info {
		padding: 40rpx;
		display: flex;
		align-items: center;
		color: #333;
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: -webkit-sticky;
		/* #endif */
		position: sticky;
		top: var(--window-top);
		z-index: 99;
		background-color: #eee;

		.name {
			font-weight: 600;
			font-size: 38rpx;
			// text-transform: uppercase;
		}

		.count {
			color: #666;
			font-size: 24rpx;
		}
	}

	.contant {
		// flex: 1;
		// overflow: scroll;

		.skeletion {
			width: 90vw;
			margin-left: 5vw;
		}

		.latter-wapper {
			padding: 0 40rpx;
		}

		.extr-info {
			margin: 10rpx 0;
			display: flex;

			.tag {
				display: flex;
				align-items: center;
				font-size: 22rpx;
				color: #fff;
				background-color: #000;
				border-radius: 10rpx;
				padding: 3rpx 15rpx;
			}

			.loc {
				margin-right: 8rpx;
				height: 30rpx;
				width: 30rpx;
				padding-bottom: 8rpx;
			}

			.loc-name {
				line-height: 22px;
			}
		}

		.letter {
			margin: 20rpx 0rpx;
			background-color: #f8f8f8;
			border-radius: 20rpx;
			padding: 20rpx;
			word-break: break-all;
			color: #333;
			font-size: 28rpx;
			line-height: 45rpx;
			word-spacing: 7rpx;
			box-shadow: 0rpx 3rpx 3rpx -2rpx rgba(0, 0, 0, 0.2), 0rpx 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.14), 0rpx 1rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
		}

		.letter:not(first-child) {
			margin-bottom: 20rpx;
		}
	}

	.avatar {
		height: 100rpx;
		width: 100rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}
}

.auth-pop {
	background-color: white;
	height: 90rpx;
	display: grid;
	border-radius: 20rpx;
	place-items: center;
	padding: 20rpx;
}
</style>
