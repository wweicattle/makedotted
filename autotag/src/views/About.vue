<template>
  <div class="about">
    <div class="left" ref="leftContain">
      <left-area
        :stateStr="stateStr"
        ref="leftRef"
        @adudge="adudge"
        class="left-area"
        :stateTag="stateTag"
        @clickDetail="clickDetailBtn"
        @cancelDelete="cancelDeleteBtn"
        @sendIntSizeRange="initSizeDesign"
        @modelTagsDetailData="modelTagsDetailData"
      ></left-area>
      <div class="left-expand-content">
        <span @click="changeAreaBtn('reduce')"
          ><a title="缩小">
            <i class="iconfont icon-suoxiao" style="font-size: 19px"></i></a
        ></span>
        <span class="size-scale-num">{{ sizeScaleVal }}</span>
        <span @click="changeAreaBtn('expand')"
          ><a title="放大"> <i class="iconfont icon-fangda"></i></a
        ></span>
      </div>
    </div>
    <div class="right">
      <right-area :detailData="detailData"></right-area>
      <div class="send-btn-content">
        <el-button type="primary" size="small" @click="sendTagsBtn"
          >模拟发送到后台标记数据，之后刷新</el-button
        >
      </div>
    </div>
  </div>
</template>
<script >

import leftArea from "../components/LeftArea.vue";
import rightArea from "../components/RightArea.vue";

export default {
  name: "HomePage",
  props: {},
  data() {
    return {
      sizeScaleVal: null,
      stateTag: 0,
      stateStr: null,
      detailData: {},
    };
  },
  created() {

  },
  mounted() {
    if (window.addEventListener)
      //FF,火狐浏览器会识别该方法
      //针对左边盒子上进行监听滚动的事件，因为右边也有一个滚动的区域，不然右边滚动左边也会滚动
      this.$refs.leftContain.addEventListener(
        "DOMMouseScroll",
        this.wheel,
        false
      );
    this.$refs.leftContain.onmousewheel = this.wheel; //W3C
  },
  components: {
    leftArea,
    rightArea,
  },
  methods: {
    // 发送具体坐标数据
    sendTagsBtn() {
      window.localStorage.setItem(
        "TAG_DATE_DETAIL",
        JSON.stringify(this.tagData)
      );
    },
    modelTagsDetailData(data) {
      // 具体发送坐标的数据
      this.tagData = data;
    },
    wheel(event) {
      var delta = 0;
      if (!event) event = window.event;
      if (event.wheelDelta) {
        console.log(event.wheelDelta)
        //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta / 120;
        // if (window.opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
      } else if (event.detail) {
        //FF浏览器使用的是detail,其值为“正负3”
        delta = -event.detail / 3;
      }
      if (delta) {
        this.handleDealWheel(delta);
      }
    },
    handleDealWheel(delta) {
      let beforeTop = Number(this.$refs.leftRef.$el.offsetTop);
      this.$refs.leftRef.$el.style.top =
        delta >= 0 ? beforeTop + 30 + "px" : beforeTop - 30 + "px";
      // }
    },
    cancelDeleteBtn() {},
    clickDetailBtn(obj = {}) {
      console.log(obj);
      this.detailData = obj;
    },
    adudge(obj) {
      this.betterSize(obj);
    },
    initSizeDesign(obj) {
      let { longModelW, shortModelW, nowWidth, nowHeight } = obj;
      this.val = longModelW - shortModelW;
      this.shortModelW = shortModelW;
      this.sizeScaleVal =
        Number((((nowWidth - this.shortModelW) / this.val) * 100).toFixed(0)) +
        "%";
      let dom = this.$refs.leftRef.$el;
      let leftContaindom = this.$refs.leftContain;
      let initWidth = obj.nowWidth;
      let initHeiht = obj.nowHeight;
      let initWidth1 = Number(
        getComputedStyle(leftContaindom).width.split("p")[0]
      );
      let initHeiht1 = Number(
        getComputedStyle(leftContaindom).height.split("p")[0]
      );
      dom.style.left = (initWidth1 - initWidth) / 2 + "px";
      dom.style.top =
        initHeiht <= initHeiht1
          ? (initHeiht1 - initHeiht) / 2 + "px"
          : -(initHeiht - initHeiht1) / 2 + "px";
    },
    // 比较宽高之后居中
    betterSize(obj) {
      // 这个方法是你点击放大缩小之后，判断盒子是否大于父盒子的高度 ，如果
      // 大于则：top不变的变化
      // 小于则：top改变 ，随着父盒子的包含块进行居中
      let dom = this.$refs.leftRef.$el;
      let initWidth = obj.nowWidth;
      this.sizeScaleVal =
        Number(Math.ceil(((initWidth - this.shortModelW) / this.val) * 100)) +
        "%";

      let initHeiht = obj.nowHeight;
      let leftContaindom = this.$refs.leftContain;
      let initWidth1 = Number(
        getComputedStyle(leftContaindom).width.split("p")[0]
      );
      let initHeiht1 = Number(
        getComputedStyle(leftContaindom).height.split("p")[0]
      );
      dom.style.left = (initWidth1 - initWidth) / 2 + "px";

      if (initHeiht < initHeiht1)
        dom.style.top = (initHeiht1 - initHeiht) / 2 + "px";
    },
    // 点击放大缩小
    changeAreaBtn(stateStr) {
      // thi
      this.stateTag = ++this.stateTag;
      this.stateStr = stateStr;
    },
  },
};
</script>
<style  scoped lang="scss">
@import url("//at.alicdn.com/t/font_1980003_f1qynsyvd0c.css");
a {
  text-decoration: none;
  padding: 0 10px;
  user-select: none;
  &:hover {
    color: #1296db;
  }
}
.about {
  display: flex;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  /* padding */
}
.left {
  border-radius: 5px;
  overflow: hidden;
  // overflow-x: hidden;
  // overflow-y:scroll;
  flex: 1;
  box-shadow: 0 0 2px #aaa;
  background-color: #fff;
  // border: 1px solid red;
  position: relative;
  .left-expand-content {
    z-index: 1000;
    position: absolute;
    bottom: 20px;
    right: 10px;
    padding-right: 10px;
    cursor: pointer;
    .size-scale-num {
      user-select: none;
    }
  }
  .send-btn-content {
    position: fixed;
    top: 0;
    left: 0;
  }
  .left-area {
    // width: 400px;
    // height: 600px;
  }
}

.right {
  // overflow-y: scroll;
  border-radius: 5px;
  margin-left: 20px;
  width: 240px;
  box-shadow: 0 0 2px #aaa;
  background-color: #fff;
  height: 90%;
  button {
    margin: 10px 0;
  }
}
</style>

