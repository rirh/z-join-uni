<template>
  <view class="wapper">
    <nav-bar
      background-color="#eee"
      title="我的个性签名"
      :shadow="false"
      :border="false"
    >
      <image
        class="icon-edit"
        slot="left"
        src="/static/edit.svg"
        mode="scaleToFill"
        @click="handle_go_edit"
      ></image>
    </nav-bar>
    <view class="content-info">
      <image class="avatar" :src="user.avatar" mode="scaleToFill"></image>
      <view class="">
        <view class="name">
          <text>{{ user.nickName }}</text>
        </view>
        <view class="count">
          <text>累计发表{{ letters.length }}条个性签名</text>
        </view>
      </view>
    </view>
    <scroll-view
      class="contant"
      scroll-y="true"
      scroll-with-animation
      @scrolltolower="fetchMoreLetters"
    >
      <skeleton :row="12" animate :loading="loading">
        <view class="letter" v-for="(letter, index) in letters" :key="index">{{
          letter.desc
        }}</view>
        <load-more :status="moreStatus" />
      </skeleton>
    </scroll-view>
  </view>
</template>
<script>
import banner from "./swiper.vue";
import moment from "moment";
import { mapGetters } from "vuex";
import navBar from "components/uni-nav-bar/uni-nav-bar.vue";
import skeleton from "components/skeleton/skeleton.vue";
import loadMore from "components/uni-load-more/uni-load-more.vue";
export default {
  components: {
    navBar,
    banner,
    skeleton,
    loadMore,
  },
  data() {
    return {
      StatusBar: this.StatusBar,
      CustomBar: this.CustomBar,
      letters: [],
      moreStatus: "loading",
    };
  },
  computed: {
    ...mapGetters({
      isLogin: "auth/isLogin",
      user: "auth/user",
      storeletters: "home/letters",
    }),
    loading() {
      return this.storeletters.loading;
    },
  },
  onTabItemTap() {
    this.init();
  },
  onLoad() {
    if (!this.isLogin) {
      uni.navigateTo({
        url: "/pages/auth/login/login",
      });
    }
  },
  onShow() {
    if (!this.letters.length) this.init();
  },
  methods: {
    async init() {
      const payload = {
        name: "letter",
        data: {
          action: "query",
          uid: this.user._id,
        },
      };
      this.moreStatus = "loading";
      await this.$store.dispatch("home/fetchLetters", payload);
      this.moreStatus = "more";
      this.letters = this.storeletters.data;
    },
    fetchMoreLetters() {
      console.log("scroll bottom");
    },
    handle_go_edit() {
      uni.navigateTo({
        url: "/pages/index/record/record",
      });
    },
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
page,
.wapper {
  background-color: #eee;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;

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
    flex: 1;
    overflow: scroll;
    .skeletion {
      width: 90vw;
      margin-left: 5vw;
    }
    .letter {
      margin: 20rpx 40rpx;
      background-color: #f8f8f8;
      border-radius: 20rpx;
      padding: 20rpx;
      word-break: break-all;
      color: #333;
      font-size: 28rpx;
      line-height: 45rpx;
      word-spacing: 7rpx;
      box-shadow: 0rpx 3rpx 3rpx -2rpx rgba(0, 0, 0, 0.2),
        0rpx 3rpx 4rpx 0rpx rgba(0, 0, 0, 0.14),
        0rpx 1rpx 8rpx 0rpx rgba(0, 0, 0, 0.12);
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
</style>
