<template>
	<block class="wapper">
		<nav-bar background-color="#eee" title="见字如见你" :shadow="false" :border="false">
			<image class="icon-edit" slot="left" src="/static/edit.svg" mode="scaleToFill" @click="handle_go_edit"></image>
		</nav-bar>
	</block>
</template>

<script>
	import moment from "moment";
	import {
		mapGetters
	} from "vuex";
	import navBar from 'components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		components: {
			navBar
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		computed: {
			...mapGetters(["isLogin"]),
		},
		onLoad() {
			if (!this.isLogin) {
				uni.navigateTo({
					url: "/pages/auth/login/login",
				});
			}
		},
		methods: {
			handle_go_edit() {
				uni.navigateTo({
					url: '/pages/index/record/record',
				});
			},
			handle_thumb(i) {
				const t = this.list[i].thumbs.length;
				if (t) {
					this.list[i].thumbs = [];
				} else {
					this.list[i].thumbs = [{
						nice: "xxx",
					}, ];
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #eee;

		.wapper {}

		
		.icon-edit {
			height: 40rpx;
			width: 40rpx;
			margin-left: 9rpx;
		}
	}
</style>
