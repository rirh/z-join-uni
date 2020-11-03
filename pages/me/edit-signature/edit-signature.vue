<template>
  <view class="wapper">
    <view class="textarea">
      <textarea
        v-model="signature"
        :row="3"
        placeholder="请输入个性签名"
        :auto-focus="true"
      />
      <view class="">
        <button class="btn">
          <image src="/static/topic.svg" mode="scaleToFill"></image>
          添加话题
        </button>
        <button
          class="btn"
          :class="{ 'btn-active': Boolean(loc.name) }"
          @click="chooseLoc"
        >
          <image
            :src="
              Boolean(loc.name)
                ? '/static/loction-white.svg'
                : '/static/loction.svg'
            "
            mode="scaleToFill"
          ></image>
          {{ loc.name || "选择地点" }}
        </button>
      </view>
    </view>
    <scroll-view class="flex-sub" scroll-y="true">
      <view
        @click="handleAddTopic(topic)"
        class="topic-list"
        v-for="(topic, index) in topicList"
        :key="index"
      >
        <view class="flex-sub">
          <view class="topic">
            {{ topic.topic }}
          </view>
          <view class="subscription">
            {{ topic.subscription }}人添加该话题
          </view>
        </view>
        <view class="add">
          <image src="/static/add.svg" mode="scaleToFill"></image>
        </view>
      </view>
    </scroll-view>
    <view class="sumbit-con">
      <button :loading="loading" class="sumbit" @click="handle_sumbit">
        发布
      </button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      signature: "",
      loc: {},
      loading: false,
      curentTopic: {},
      topicList: [
        {
          topic: "#所爱隔山海 山海不可平#",
          subscription: "21315523",
        },
        {
          topic: "#所爱隔山海 山海亦可平#",
          subscription: "55231236",
        },
        {
          topic: "#十一月你好#",
          subscription: "817253415",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    async handle_sumbit() {
      if (this.loading) return;
      this.loading = true;
      const user = this.user;
      const result = await this.$store.dispatch("home/insterLetter", {
        author: user.nickName,
        catagory: [],
        contant: "",
        createtime: Date.now(),
        desc: this.signature,
        loction: JSON.stringify(this.loc),
        uid: user._id,
        avatar: user.avatar,
      });
      this.loading = false;
      uni.showToast({
        duration: 3000,
        position: "bottom",
        icon: "none",
        title: "发布成功",
        success() {
          uni.navigateBack();
        },
      });
    },
    handleAddTopic(item) {
      if (!~this.signature.indexOf(item.topic)) {
        this.signature += item.topic;
      }
    },
    chooseLoc() {
      uni.chooseLocation({
        success: (res) => {
          this.loc = res;
          console.log("位置名称：" + res.name);
          console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
        },
      });
    },
  },
};
</script>
<style lang="scss">
.wapper {
  background-color: #eee;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .textarea {
    padding: 20rpx;
    background-color: white;
    margin-bottom: 20rpx;
    > textarea {
      color: #333;
      width: 100%;
      font-size: 28rpx;
    }
  }
  .btn {
    margin-left: 10rpx;
    height: 40rpx;
    font-size: 22rpx;
    text-align: center;
    line-height: 40rpx;
    color: #666;
    transition: color 0.3s, background-color 0.3s;
    padding: 10rpx 20rpx;
    > image {
      height: 30rpx;
      width: 30rpx;
      margin-right: 10rpx;
    }
  }
  .btn-active {
    color: #fff;
    background-color: #000000;
  }
  .topic-list {
    display: flex;
    background-color: white;
    align-items: center;
    .topic {
      color: #333;
      font-size: 32rpx;
      margin: 10rpx 20rpx;
    }
    .subscription {
      color: #666;
      font-size: 24rpx;
      margin: 10rpx 20rpx 20rpx;
    }
    .add {
      margin-right: 20px;
      > image {
        height: 60rpx;
        width: 60rpx;
      }
    }
  }

  .topic-list:active {
    background-color: #eee;
  }

  .sumbit-con {
    padding-bottom: 20rpx;
  }
  .sumbit {
    height: 80rpx;
    width: 90vw;
    margin-left: 5vw;
    background: #000;
    color: #fff;
    font-size: 32rpx;
    text-align: center;
    margin-top: 90rpx;
  }
}
</style>
