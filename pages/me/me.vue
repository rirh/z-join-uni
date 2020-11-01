<template>
	<view class="wapper">
		<skeleton :row="3" animate :loading="!user.nickName">
			<navigator url="/pages/me/user-info/user-info">
				<view class="setion">
					<image class="head-img" :src="user.avatar || '/static/headimg.svg'" mode="scaleToFill"></image>
					<view class="user-info">
						<view class="">
							<text class="user">{{ user.email || user.mobile || user.nickName }}</text>
						</view>
						<view class="">
							<text class="id">上次登录时间：{{ moment(user.last_login_date).format('YYYY-MM-DD hh:mm') }}</text>
						</view>
					</view>
					<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
				</view>
			</navigator>
		</skeleton>
		<navigator url="/pages/me/security/security">
			<view class="setion-top active" style="margin-top: 32rpx">
				<image class="label-icon" src="/static/security.svg" mode="scaleToFill"></image>
				<text class="label flex-sub">安全</text>
				<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
			</view>
		</navigator>
		<view class="setion-top active">
			<image class="label-icon" src="/static/setting.svg" mode="scaleToFill"></image>
			<text class="label flex-sub">设置</text>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>

		<view class="setion active">
			<image class="label-icon" src="/static/about.svg" mode="scaleToFill"></image>
			<text class="label flex-sub">关于</text>
			<image class="allow-right" src="/static/right.svg" mode="scaleToFill"></image>
		</view>
		<view @click="handle_logout" class="setion active" style="margin-top: 32rpx">
			<image class="label-icon" src="/static/exit.svg" mode="scaleToFill"></image>
			<text class="label">退出</text>
		</view>
	</view>
</template>

<script>
import skeleton from 'components/skeleton/skeleton.vue';

import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
	data() {
		return {};
	},
	components: {
		skeleton
	},
	computed: {
		...mapGetters({
			user: 'auth/user'
		})
	},
	onLoad() {},
	onShow() {
		this.$store.dispatch('auth/getUserInfo');
	},
	methods: {
		moment,

		handle_go_edit() {
			uni.navigateTo({
				url: '/pages/me/user-info/user-info'
			});
		},
		handle_logout() {
			this.$store.dispatch('auth/logout');
		}
	}
};
</script>

<style lang="scss" scoped>
page,
.wapper {
	background-color: #eee;
	height: 100vh;
}

.setion,
.setion-top {
	background-color: #fff;
	position: relative;
	display: flex;
	min-height: 100rpx;
	align-items: center;

	.label {
		font-weight: 400;
		font-size: 32rpx;
	}

	.label-icon {
		height: 45rpx;
		width: 45rpx;
		margin: 0 20rpx;
	}
}

.active:active {
	background-color: #d8d8d8;
}

.head-img {
	height: 150rpx;
	width: 150rpx;
	min-width: 150rpx;
	background-color: #fff;
	border-radius: 50%;
	margin-left: 40rpx;
	margin: 20rpx;
}

.allow-right {
	height: 55rpx;
	width: 55rpx;
	margin-right: 20rpx;
	justify-self: flex-end;
}

.user-info {
	margin-left: 20rpx;
	font-size: 32rpx;
	font-weight: 600;
	flex: 1;
	overflow: hidden;

	.user {
		font-size: 32rpx;
		// text-transform: capitalize;
	}

	.id {
		font-size: 24rpx;
		color: #666;
	}
}

.setion::after {
	content: ' ';
	width: 200%;
	height: 200%;
	position: absolute;
	top: 0;
	left: 0;
	border-radius: inherit;
	transform: scale(0.5);
	transform-origin: 0 0;
	pointer-events: none;
	box-sizing: border-box;
	border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
	border-top: 2rpx solid rgba(0, 0, 0, 0.1);
}
.setion-top::after {
	content: ' ';
	width: 200%;
	height: 200%;
	position: absolute;
	top: 0;
	left: 0;
	border-radius: inherit;
	transform: scale(0.5);
	transform-origin: 0 0;
	pointer-events: none;
	box-sizing: border-box;
	border-top: 2rpx solid rgba(0, 0, 0, 0.1);
}
</style>
