<template>
  <view class="wapper"> </view>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
export default {
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
    handle_thumb(i) {
      const t = this.list[i].thumbs.length;
      if (t) {
        this.list[i].thumbs = [];
      } else {
        this.list[i].thumbs = [
          {
            nice: "xxx",
          },
        ];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #eee;
  .wapper {
  }
}
</style>
