<template>
	<view>me
		<navigator url="/pages/words-like-meet/words-like-meet">/pages/words-like-meet/words-like-meet</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {},
		onShow() {
			uniCloud.callFunction({
				name: 'user-center',
				data: {
					params: {
						action: 'getUserInfo'
					}
				},
				success(res) {
					console.log(res);
					if (!code) {
						console.log(response_data);
					} else {
						uni.showToast({
							title: msg,
							icon: 'none',
							position: 'bottom',
							success() {
								uni.navigateTo({
									url: '/pages/auth/login/login'
								});
							}
						});
					}
				}
			});
		},
		methods: {}
	};
</script>

<style></style>
