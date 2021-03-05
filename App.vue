<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    uni.setStorageSync("carrot", 6);
    // #ifdef MP-WEIXIN
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          uni.request({
            method: "POST",
            url:
              "https://8597e222-5d79-4aba-8825-7d8c02733833.bspapp.com/http/register",
            data: {
              appid: "d3gxODY4YjRhOTlhMjk3ZDA1",
              secret: "YzRhOTA2ZTc3OWU3OTQwZjMxOTYyZGQ5ZmVmZjg1M2I=",
              action: "openid",
              code: res.code,
            },
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
    // #endif
  },
  onShow: function () {
    uni.setKeepScreenOn({
      keepScreenOn: true,
    });
    console.log("App Show");
    uni.setStorageSync("carrot", 6);
    const store = uni.getStorageSync("store");
    if (store) {
      const storeData = Object.assign({}, this.$store.state, JSON.parse(store));
      this.$store.replaceState(storeData);
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
