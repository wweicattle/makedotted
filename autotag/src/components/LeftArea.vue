<template>
  <div
    class="draggable-container"
    ref="parentRef"
    @contextmenu="contextMenuBtn"
    @click="parengClickBtn"
    :style="{ width: imgW }"
  >
    <img
      :src="backImg"
      alt=""
      @mousedown="mouseDownBtn"
      ref="imgRef"
      @load="imgload"
    />
    <template v-for="(val, index) in addGraCoordinate">
      <VueDragResize
        :key="index"
        :w="val.width"
        :h="val.height"
        :x="val.left"
        :y="val.top"
        v-on:resizing="resize"
        v-on:dragging="resize"
        :isResizable="false"
        :parentW="nowWidth"
        :parentH="nowHeight"
        :parentLimitation="true"
        style="background: transport; border-radius: 50%"
        @clicked="clickModelBtn(index)"
        @dragstop="ondreopStop(index)"
        :isActive="isActive == index"
      >
        <img src="../assets/dibiao.png" alt="" />
      </VueDragResize>
    </template>

    <ul class="ul-content" ref="ul">
      <li @click="deleteModelBtn">删除</li>
      <li @click="addModelBtn">标记</li>
    </ul>
  </div>
</template>

<script>
import VueDragResize from "vue-drag-resize";
import eventbus from "../utils/evenbus";
export default {
  name: "leftArea",
  props: {
    stateStr: {
      type: String,
      default: null,
    },
    stateTag: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      ss:233,
      imgW: "260px",
      backImg: "static/img/test4.jpg",
      nowWidth: null,
      nowHeight: null,
      isActive: -1,
      ul: null,
      longDottedSizeW: 1300,
      shortDottedSizeW: 200,
      addGraCoordinate: [
        // { top: 0, left: 0, width: 20, height: 20 },
        // { top: 100, left: 130, width: 20, height: 20 },
        // { top: 200, left: 230, width: 20, height: 20 },
        // { top: 300, left: 30, width: 20, height: 20 },
      ],
    };
  },
  created() {
    // 是否 从 后台 里面传进来已有的图片打点记录,有则初始化数据
    let tagData =
      JSON.parse(window.localStorage.getItem("TAG_DATE_DETAIL")) || {};
    if (Object.keys(tagData).length > 0) {
      let { addGraCoordinate, nowWidth, nowHeight, imgSrc } = tagData;
      this.backImg = imgSrc;
      this.imgW = nowWidth + "px";
      this.addGraCoordinate = addGraCoordinate;
    }
  },
  mounted() {
    // 监听右边区域删除打点model
    eventbus.$on("pleaseDelModel", () => {
      this.addGraCoordinate.splice(this.isActive, 1);
      this.isActive = -1;
      this.$emit("clickDetail", {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        isopenDel: false,
      });
    });

    eventbus.$on("addModel", () => {
      this.addGraCoordinate.push({
        left: 200,
        top: 200,
        width: 20,
        height: 20,
      });
    });
  },

  components: {
    // ResizeAble,
    VueDragResize,
  },
  methods: {
    deleteModelBtn() {
      if (!(this.isActive >= 0)) return;
      // 确定当前有选中dosomething........
      this.addGraCoordinate.splice(this.isActive, 1);
      this.isActive = -1;
      // 右边区域size应该重置为初始化无
      this.$emit("clickDetail", {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        isopenDel: false,
      });
      // contextMenu隐藏
      this.$refs.ul.style.display = "none";
    },
    addModelBtn(e) {
      let { offsetX: left, offsetY: top } = e;
      // 添加一个新的打点记录
      this.addGraCoordinate.push({
        left: this.offsetX,
        top: this.offsetY,
        width: 20,
        height: 20,
      });
      this.isActive = this.addGraCoordinate.length - 1;
      this.$emit("clickDetail", {
        ...this.addGraCoordinate[this.addGraCoordinate.length - 1],
        isopenDel: true,
      });
      this.$refs.ul.style.display = "none";
    },
    parengClickBtn(e) {
      //  adudge如果点击之外隐藏标记与删除盒子contextMenu
      if (e.target.tagName != "LI") {
        this.$refs.ul.style.display = "none";
      }
    },
    // 图片加载完进行将图片撑高的高度发送到父盒子中，之后整体进行居中
    imgload() {
      this.nowWidth = this.$refs.imgRef.offsetWidth;
      this.nowHeight = this.$refs.imgRef.offsetHeight;
      // 图片加载完 子盒子在父盒子中居中布局
      this.$emit("sendIntSizeRange", {
        longModelW: this.longDottedSizeW,
        shortModelW: this.shortDottedSizeW,
        nowWidth: this.nowWidth,
        nowHeight: this.nowHeight,
      });
    },
    contextMenuBtn(e) {
      this.$refs.ul.style.display = "block";
      e.preventDefault();
      this.$refs.ul.style.left = e.clientX + "px";
      this.$refs.ul.style.top = e.clientY + "px";
      let { offsetX, offsetY } = e;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
    },
    ondreopStop(indexs) {
      this.addGraCoordinate.forEach((val, index) => {
        if (indexs == index) {
          this.addGraCoordinate[index] = this.newRect;
        }
        return;
      });
    },
    clickModelBtn(index) {
      // 记录 当前点击的打点model-Index
      this.isActive = index;
    },
    mouseUpBtn(e) {
      console.log(e);
    },
    mouseDownBtn(e) {
      let dom = this.$refs.parentRef;
      // 点击之后记录的值
      let { clientX: x, clientY: y } = e;
      let boxPosLeft = dom.offsetLeft;
      let boxPosTop = dom.offsetTop;
      document.onmousemove = function (e) {
        // 移动的值得坐标
        let { clientX, clientY } = e;
        let changeX = clientX - x;
        let changeY = clientY - y;
        dom.style.left = changeX + boxPosLeft + "px";
        dom.style.top = changeY + boxPosTop + "px";
        return false;
      };
      document.onmouseup = function () {
        // 设置必须点击拖动才可以移动拖拽
        document.onmousemove = null;
        return false;
      };
      // 必须添加
      e.preventDefault();
      return false;
    },
    judgSize() {},
    resize(newRect) {
      this.newRect = newRect;
      this.$emit("clickDetail", {
        ...newRect,
        isopenDel: true,
      });
      return newRect;
    },
  },
  watch: {
    // 放大或者缩小
    stateTag(newVal) {
      let beforeWidth = Number(
        getComputedStyle(this.$refs.parentRef).width.split("p")[0]
      );
      let beforeHeihgt = Number(
        getComputedStyle(this.$refs.parentRef).height.split("p")[0]
      );
      // 判断点击放大还是缩小，按20px进行变化
      let nowWidth =
        this.stateStr == "expand" ? beforeWidth + 20 : beforeWidth - 20;
      let nowHeight = (nowWidth * beforeHeihgt) / beforeWidth.toFixed(2);
      // 放大 缩小的限制范围
      if (nowWidth <= this.shortDottedSizeW || nowWidth > this.longDottedSizeW)
        return;
      this.$refs.parentRef.style.width = nowWidth + "px";
      this.$refs.parentRef.style.height = nowHeight + "px";
      this.nowHeight = nowHeight;
      this.nowWidth = nowWidth;
      // 发送给外部父盒子的大小，之后父盒子再对整体子盒子居中
      this.$emit("adudge", {
        longModelW: this.longDottedSizeW,
        shortModelW: this.shortDottedSizeW,
        nowWidth: this.nowWidth,
        nowHeight: this.nowHeight,
      });
      this.$nextTick(() => {
        // 对里面的坐标进行等比例大小变化
        if (this.addGraCoordinate.length) {
          this.addGraCoordinate.forEach((val) => {
            let { left, top } = val;
            val.left = (left * nowWidth) / beforeWidth;
            val.top = (top * nowHeight) / beforeHeihgt;
            // console.log(val);
          });
        }
      });
    },
    nowWidth(newVal) {
      console.log(333333333);
      let { addGraCoordinate, nowWidth, nowHeight } = this.$data;
      console.log(nowHeight);
      this.$emit("modelTagsDetailData", {
        addGraCoordinate,
        nowHeight: Number(nowHeight.toFixed(2)),
        nowWidth,
        imgSrc: this.backImg,
      });
    },
  
      // immediate: true,
  },
};
</script>

<style  lang="scss">
.ul-content {
  display: none;
  user-select: none;
  // cursor: default;
  color: rgb(136, 133, 133);
  border: 1px solid transparent;
  border-right-color: #5062c2;
  border-bottom-color: #5062c2;
  border-radius: 3px;
  z-index: 1;
  background: linear-gradient(145deg, #ffffff, #adadb1);
  position: fixed;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ccc;
  li {
    font-size: 12px;
    list-style: none;
    padding: 6px 9px;
    &:first-child {
      border-bottom: 1px solid #ccc;
    }
    &:hover {
      color: rgb(117, 113, 113);
      list-style: none;
      background-color: rgba(37, 36, 36, 0.09);
    }
  }
}
.draggable-container {
  cursor: grabbing;
  overflow: hidden;
  border: 1px solid rgb(119, 119, 118);
  font-size: 0;
  .vdr.active:before {
    border: 1px dotted #000;
  }
  img {
    width: 100%;
    display: block;
    vertical-align: middle;
  }
  // width: 260px;
  // height: 600px;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  box-sizing: border-box;
}
</style>