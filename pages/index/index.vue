<template>
  <view>
    <view class="title" @click="handle_open_dev">
      <view class="" v-if="integral > 0">
        <text v-for="item in integral" :key="item">🥕</text> &nbsp; x
        {{ integral }}
      </view>
      <view class="" v-else> 分享👇 获得🥕 </view>
    </view>
    <textScroll v-if="iswork" :text="tips"></textScroll>
    <view class="" v-if="integral <= 0">
      <!-- #ifdef MP-WEIXIN -->
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        open-type="share"
        :disabled="integral > 0"
        @click="handle_buy"
      >
        获得🥕
      </button>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <button type="default" :disabled="integral > 0" @click="handle_buy">
        购买🥕
      </button>
      <!-- #endif -->
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 3 || integral <= 0"
        @click="handle_do_3"
      >
        小兔子🐰舒缓の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 4 || integral <= 0"
        @click="handle_do_4"
      >
        小兔子🐰活力の服务
      </button>
    </view>

    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 1 || integral <= 0"
        @click="handle_do_1"
      >
        小狐狸🦊安神の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 2 || integral <= 0"
        @click="handle_do_2"
      >
        小狐狸🦊禅式の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 7 || integral <= 0"
        @click="handle_do_7"
      >
        小公主👸芳香の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 8 || integral <= 0"
        @click="handle_do_8"
      >
        小公主👸尊贵の服务
      </button>
    </view>

    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 5 || integral <= 0"
        @click="handle_do_5"
      >
        小狐狸🦊、小兔子🐰和小公主👸一起专享の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="model === 6 || integral <= 0"
        @click="handle_do_6"
      >
        小狐狸🦊、小兔子🐰和小公主👸一起帝王の服务
      </button>
    </view>
    <view class="">
      <button
        type="default"
        class="hu-btn  margin-left-sm"
        :disabled="iswork === false"
        @click="handle_stop"
      >
        贤者🏖️时间
      </button>
    </view>
    <view class="" v-if="dev_open">
      <view>
        <slider
          @change="(e) => (duration = e.detail.value)"
          show-value
          :max="10000"
          :mim="1"
        />
      </view>
      <view class="uni-list">
        <view class="uni-list-cell uni-list-cell-pd">
          <switch @change="handleChange" :checked="type === 'vibrateLong'" />
          <text>{{ type }}</text>
        </view>
      </view>
      <view class="uni-list">
        <radio-group @change="(e) => (model = e.target.value)">
          <label
            class="uni-list-cell uni-list-cell-pd"
            v-for="(item, index) in 8"
            :key="item.value"
          >
            <view>
              <radio :value="item" :checked="item + 1 === model" />
            </view>
            <text>{{ item + 1 }}</text>
          </label>
        </radio-group>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell uni-list-cell-pd">
          <button type="default" @click="handle_start">开始</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import textScroll from "./scroll-text.vue";

function gen_random(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min, 10);
}
export default {
  components: {
    textScroll,
  },
  data() {
    return {
      integral: 0,
      iswork: false,
      model: -1,
      timer: {},
      count: 0,
      tips_arr: {
        1: [
          "小狐狸🦊服务中,每3000ms的の放在舒适的位置有利于血液循环，の缓解压力是首先浮现在脑海中想の治疗时的好处之一。这也是一个人试图实现健康的生活方式的重要组成部分。临床研究表明，即使是单一1个半小时的の，可以显著降低心跳率，皮质醇水平和胰岛素水平，其中通过の疗法帮助减轻压力。",
        ],
        2: [
          "小狐狸🦊服务中,每2000ms的の放在舒适的位置有利于血液循环，身体可以产生不健康的激素积累，当我们在拥挤的车流，或满足工作的最后期限。压抑已久的“应激激素”皮质醇水平，可导致失眠，头痛，甚至消化问题。の已被证明，以减少身体的皮质醇。这使身体进入一个轻松的休息和恢复模式。事实上，の触发了大脑的化学反应，可能导致持久的松弛的感情，降低了压力和改善情绪。",
        ],
        3: [
          "小兔子🐰服务中,每1000ms的のの可以放松，放松不良姿势导致疼痛的肌肉，让你的身体本身定位在其自然的和痛苦的自由姿态。与正在进行的の肌肉的放松，放松关节有更大的自由和压力点。这让身体自己定位在一个健康的和自然的姿势，从而避免随着时间的推移的运动和对疼痛的反应的立场。",
        ],
        4: [
          "小兔子🐰服务中,每500ms的の放在舒适的位置有利于血液循环，比皮肤更深层的の疗法的长期效果。更好的血液循环是定期接受の治疗的结果，在体内发生的连锁反应的一部分。",
        ],
        5: [
          "小狐狸🦊、小兔子🐰和小公主👸服务中,尊贵享受，の疗法是一种有利于保持和提高灵活性和运动治疗。通过对肌肉，结缔组织，肌腱，韧带及关节的工作，经常の可以提高你的灵活性和范围的议案，让你的关节更流畅，使他们不太容易受伤。",
        ],
        6: [
          "小狐狸🦊、小兔子🐰和小公主👸服务中,帝王享受中，临床研究已表明，经常の不仅有助于减轻压力，但可以自然增加免疫系统的杀伤能力（对人体的天然“杀手细胞”活动的水平）和降低的T细胞，数量提高了机体的免疫功能的整体。",
        ],
        7: [
          "小公主👸服务中,尊贵享受，の疗法是一种有利于保持和提高灵活性和运动治疗。通过对肌肉，结缔组织，肌腱，韧带及关节的工作，经常の可以提高你的灵活性和范围的议案，让你的关节更流畅，使他们不太容易受伤。",
        ],
        8: [
          "小公主👸服务中,帝王享受中，临床研究已表明，经常の不仅有助于减轻压力，但可以自然增加免疫系统的杀伤能力（对人体的天然“杀手细胞”活动的水平）和降低的T细胞，数量提高了机体的免疫功能的整体。",
        ],
      },
      tips: "",
      stop_tips_array: [
        "记得多喝点水哦～",
        "你也想吃胡萝卜么？",
        "记住刚刚的美好的时光",
        "One more time ?",
        "营养要跟上嗷",
        "我贤者我自己～",
        "oh，就是刚刚！美好时光！",
      ],
      duration: 0,
      type: "vibrateLong",

      dev_open: false,
      dev_count: 0,
      dev_timer: {},
    };
  },
  onShow() {
    this.integral = uni.getStorageSync("carrot");
  },
  onShareAppMessage: function (options) {
    return {
      title: "【🐰 SPA】领取🥕 吧！",
      path: "/pages/index/index",
    };
  },
  onHide() {
    this.handle_stop();
  },
  methods: {
    handle_start() {
      this.count = this.count + 1;
      this.tips = this.tips_arr[this.model][
        gen_random(0, this.tips_arr[this.model].length - 1)
      ];
      switch (this.model) {
        case 1:
          this.duration = gen_random(1000, 3000);
          this.type = "vibrateLong";
          break;
        case 2:
          this.duration = gen_random(1000, 2000);
          this.type = "vibrateLong";
          break;
        case 3:
          this.duration = 1000;
          this.type = "vibrateShort";
          break;
        case 4:
          this.duration = 500;
          this.type = "vibrateShort";
          break;
        case 5:
          this.duration = 300;
          this.type = Math.random() >= 0.5 ? "vibrateLong" : "vibrateShort";
          break;
        case 6:
          this.duration = 100;
          this.type = Math.random() >= 0.5 ? "vibrateLong" : "vibrateShort";
          break;
        case 7:
          this.duration = (this.count + 1) % 7 === 0 ? 400 : 200;
          this.type =
            (this.count + 1) % 7 === 0 ? "vibrateLong" : "vibrateShort";
          break;
        case 8:
          this.duration = (this.count + 1) % 7 === 0 ? 200 : 50;
          this.type =
            (this.count + 1) % 7 === 0 ? "vibrateLong" : "vibrateShort";
          break;
        default:
          break;
      }
      console.log(this.duration, this.type);
      this.timer = setTimeout(() => {
        uni[this.type]({
          success: () => {
            if (this.iswork) this.handle_start();
          },
        });
      }, this.duration);
    },

    handle_do_1() {
      clearTimeout(this.timer);
      this.iswork = false;
      this.model = 1;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;
      this.handle_tips();
      this.handle_start();
    },
    handle_do_2() {
      clearTimeout(this.timer);
      this.iswork = false;
      this.model = 2;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();
      this.handle_start();
    },
    handle_do_3() {
      clearTimeout(this.timer);

      this.iswork = false;

      this.model = 3;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();

      this.handle_start();
    },
    handle_do_4() {
      clearTimeout(this.timer);

      this.iswork = false;

      this.model = 4;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();

      this.handle_start();
    },
    handle_do_5() {
      clearTimeout(this.timer);

      this.iswork = false;

      this.model = 5;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();

      this.handle_start();
    },
    handle_do_6() {
      clearTimeout(this.timer);

      this.iswork = false;
      this.model = 6;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();
      this.handle_start();
    },
    handle_do_7() {
      clearTimeout(this.timer);

      this.iswork = false;
      this.model = 7;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();
      this.handle_start();
    },
    handle_do_8() {
      clearTimeout(this.timer);

      this.iswork = false;
      this.model = 8;
      this.integral -= 1;
      this.iswork = true;
      this.count = 0;

      this.handle_tips();
      this.handle_start();
    },
    handle_stop() {
      if (!this.iswork) return;
      this.iswork = false;
      this.model = -1;
      this.count = 0;
      this.dev_open = false;

      clearTimeout(this.timer);
      const tips = this.stop_tips_array[
        gen_random(0, this.stop_tips_array.length - 1)
      ];
      uni.showToast({
        duration: 2000,
        title: tips,
        icon: "none",
      });
    },
    handle_tips() {
      uni.showToast({
        duration: 2000,
        title: "🥕 -1",
        icon: "none",
      });
    },
    handle_buy() {
      console.log("打开广告源");
    },
    handle_open_dev() {
      clearTimeout(this.dev_timer);
      this.dev_count = this.dev_count + 1;
      this.dev_timer = setTimeout(() => {
        this.dev_count = 0;
      }, 300);
      console.log(this.dev_count);

      if (this.dev_count >= 5) {
        this.dev_open = true;
      }
    },
    handleChange({ detail }) {
      this.type = detail.value ? "vibrateLong" : "vibrateShort";
    },
  },
};
</script>

<style>
.title {
  padding-top: var(--status-bar-height);
  height: 90px;
  line-height: 90px;
  box-sizing: border-box;
  padding-left: 20px;
}

button {
  margin: 10rpx;
}
</style>
