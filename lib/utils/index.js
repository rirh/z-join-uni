/**
 * utils
 * 
 * by tigerzh
 */
import Vue from 'vue'

function setStateBar() {
	uni.getSystemInfo({
		success: function(e) {
			// #ifndef MP
			Vue.prototype.StatusBar = e.statusBarHeight;
			if (e.platform == 'android') {
				Vue.prototype.CustomBar = e.statusBarHeight + 50;
			} else {
				Vue.prototype.CustomBar = e.statusBarHeight + 45;
			};
			// #endif

			// #ifdef MP-WEIXIN || MP-QQ
			Vue.prototype.StatusBar = e.statusBarHeight;
			let capsule = wx.getMenuButtonBoundingClientRect();
			if (capsule) {
				Vue.prototype.Custom = capsule;
				// Vue.prototype.capsuleSafe = uni.upx2px(750) - capsule.left + uni.upx2px(750) - capsule.right;
				Vue.prototype.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
			} else {
				Vue.prototype.CustomBar = e.statusBarHeight + 50;
			}
			// #endif		


			// #ifdef MP-ALIPAY
			Vue.prototype.StatusBar = e.statusBarHeight;
			Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
			// #endif
		}
	})
}

function initPush() {
	plus.push.addEventListener("click", function(e) {
		console.group();
		console.log("=============click broad===========");
		console.log(e);
		console.log("=============click broad end===========");
		console.groupEnd();
	}, true);

	plus.push.addEventListener("receive", function(e) {
		console.group();
		console.log("=============click broad===========");
		console.log(e);
		console.log("=============click broad end===========");
		console.groupEnd();
	}, true);
}

function showToast(title) {
	uni.showToast({
		duration: 3000,
		icon: "none",
		position: "bottom",
		title: `${title}`
	})
}

export default {
	showToast,
	setStateBar,
	initPush
}
