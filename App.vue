<script>
import lib from "lib/utils";
const { setStateBar, initPush } = lib;
export default {
  onLaunch: function () {
    console.log("App Launch");
    setStateBar();
    // #ifdef APP-PLUS
    initPush();
    // #endif
  },
  onShow: function () {
    console.log("App Show");
	this.$store.dispatch('auth/getUserInfo');
    const store = uni.getStorageSync("store");
    if (store) {
      this.$store.replaceState(
        Object.assign({}, this.$store.state, JSON.parse(store))
      );
    }
    // #ifdef H5
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
    // #endif
  },
  onHide: function () {
    console.log("App Hide");
    uni.setStorageSync("store", JSON.stringify(this.$store.state));
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url("styles/index.scss");
</style>
