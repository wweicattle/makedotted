<template>
  <div
    class="draggable-container"
    ref="parentRef"
    @contextmenu="contextMenuBtn"
    @click="parengClickBtn"
    :style="{ width: imgW }"
  >
    <!-- 背景图片 -->
    <img
      :src="backImg"
      alt=""
      @mousedown="mouseDownBtn"
      ref="imgRef"
      @load="imgload"
    />
    <!-- 区域容器-->
    <svg
      id="svg"
      ref="svg"
      :width="nowWidth"
      :height="nowHeight"
      @mousedown="mouseDownBtn"
      @click="svgclick"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <text x="350" y="205" fill="#000" font-size="40px">女装区</text>

      <template v-for="(val, index) in areas">
        <polygon
          :key="index"
          :points="val.points"
          :style="
            val.style
              ? val.style
              : 'fill: lime; stroke: purple; stroke-width: 1'
          "
          @dblclick.stop="polydlBtns"
          @click.stop="polydlBtn"
        >
          <div style="position: absolute; top: 0">lorem</div>
        </polygon>
      </template>
      <!-- <polygon
        points=" 100,0 300,410 170,450 "
        style="fill: lime; stroke: purple; stroke-width: 0"
      /> -->
    </svg>
    <!-- 打点区域 -->
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
        <!-- <div style="fontSize:20px">
          lorem
        </div> -->
      </VueDragResize>
    </template>

    <!-- 右键组件 -->
    <ul class="ul-content" ref="ul">
      <li>1. 打点</li>
      <li @click="deleteModelBtn">删除打点</li>
      <li @click="addModelBtn">标记节点</li>
      <li>2. 区域</li>
      <li @click="areaBackBtns">撤销上一步</li>
      <li @click="addAreaBtns">区域开始</li>
      <li @click="addAreaSucss">区域完成</li>
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
      // 区域容器
      areas: [],
      //  sum 0,1,2表区域打点的开始，打点中，打点结束
      sum: 0,
      imgW: "260px",
      imgH: "400px",
      backImg: "static/img/test4.jpg",
      nowWidth: null,
      nowHeight: null,
      isActive: -1,
      ul: null,
      longDottedSizeW: 1200,
      shortDottedSizeW: 200,
      // 打点容器
      addGraCoordinate: [
        // { top: 0, left: 0, width: 20, height: 20 },
        // { top: 100, left: 130, width: 20, height: 20 },
        // { top: 200, left: 230, width: 20, height: 20 },
        // { top: 300, left: 30, width: 20, height: 20 },
      ],
      // addAreas: [],
    };
  },
  created() {
    // 是否 从 后台里面传进来已有的图片打点记录,有则初始化数据
    let tagData =
      JSON.parse(window.localStorage.getItem("TAG_DATE_DETAIL")) || {};
    if (Object.keys(tagData).length > 0) {
      let { addGraCoordinate, nowWidth, nowHeight, imgSrc } = tagData;
      this.backImg = imgSrc;
      this.imgW = nowWidth + "px";
      this.imgH = nowHeight + "px";
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

    // 添加打点按钮
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
    VueDragResize,
  },
  methods: {
    // 双击区域表示持出先选中
    polydlBtns(){
       this.areas[this.areas.length - 1].style =
            "fill:lime;stroke:rgb(128, 73, 0);stroke-width:1";
            this.dbclick=true;
    },
    // 区域单击表示闭环
    polydlBtn() {
      // this.setTime = setTimeout((val) => {
        if(this.sum==-1)return;
        if (this.sum == 1) {
          // 区域完成，设置sum=-1表示打点结束
          this.sum = -1;
          // 将区域边框去掉
          this.$refs.ul.style.display = "none";
          this.areas[this.areas.length - 1].style =
            "fill:lime;stroke:rgb(128, 73, 0);stroke-width:0";
        }
      // }, 200);
    },
    // 添加一个区域
    addPolygonArea(x, y) {
      if (this.sum == 0) {
        let obj = {};
        obj.points = `${x},${y}`;
        obj.style = "fill:lime;stroke:rgb(128, 73, 0);stroke-width:1";
        this.areas.push(obj);
        // 打点中
        this.sum = 1;
        //   this.paylon = document.createElementNS(
        //     "http://www.w3.org/2000/svg",
        //     "polygon"
        //   );
        //   this.paylon.setAttribute("points", `${x},${y}`);
        //   this.paylon.style = "fill:lime;stroke:rgb(128, 73, 0);stroke-width:1";
        //   this.$refs.svg.appendChild(this.paylon);
      } else if (this.sum == 1) {
        // let f = this.paylon.attributes.points.nodeValue;
        // this.paylon.setAttribute("points", f + ` ${x},${y}`);
        this.areas[this.areas.length - 1].points =
          this.areas[this.areas.length - 1].points + ` ${x},${y}`;
      }
    },

    // 点击开始区域
    addAreaBtns() {
      if (this.sum == 1) return;
      // sum 0,1,2表区域打点的开始，打点中，打点结束
      this.sum = 0;
      this.addPolygonArea(this.offsetX, this.offsetY);
      this.$refs.ul.style.display = "none";
    },

    // 区域过程中
    svgclick(e) {
      if (this.sum == 1) {
        this.addPolygonArea(e.offsetX, e.offsetY);
      }
    },

    // 区域撤销上一步
    areaBackBtns() {
      if (this.sum != -1) {
        let f = this.areas[this.areas.length - 1].points;
        console.log(f.split(" "));
        let arr = f.split(" ");
        arr.pop();
        let str = arr.join(" ");
        this.areas[this.areas.length - 1].points = str;
        this.$refs.ul.style.display = "none";
      }
    },

    // 点击区域成功！
    addAreaSucss() {
      if (this.sum == 1) {
        // 区域完成，设置sum=-1表示打点结束
        this.sum = -1;
        // 将区域边框去掉
        this.$refs.ul.style.display = "none";
        this.areas[this.areas.length - 1].style =
          "fill:lime;stroke:rgb(128, 73, 0);stroke-width:0";
        // let f = this.paylon.attributes.points.nodeValue;
        // var arr = f.split(" ");
        // console.log(arr);
        // arr = arr.map((val) => {
        //   var f = val.split(",");
        //   return [f[0], f[1]];
        // });
        // let g = Object.assign(this.paylon);
        // let obj = new Map();
        // obj.set(g, arr);
        // this.addAreas.push(obj);
      }
    },

    // 删除打点
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

    // 添加打点
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

    // 影藏oncontextMenu
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
    // 右键菜单组件
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
      // console.log(newVal);
      // this.$refs.parentRef.style.transform="scale(1.5)"
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
        console.log(3333333, this.addGraCoordinate);
        // 对里面的坐标进行等比例大小变化
        if (this.addGraCoordinate.length) {
          this.addGraCoordinate.forEach((val) => {
            let { left, top } = val;
            val.left = (left * nowWidth) / beforeWidth;
            val.top = (top * nowHeight) / beforeHeihgt;
          });
        }
        // 对里面的区域等比例放大或缩小
        if (this.areas.length) {
          this.areas.forEach((val) => {
            let arr = val.points.split(" ");
            val.points = arr
              .map((val) => {
                let str = val.split(",");
                var left = ((str[0] * nowWidth) / beforeWidth).toFixed(2);
                var top = ((str[1] * nowHeight) / beforeHeihgt).toFixed(2);
                return `${left},${top}`;
              })
              .join(" ");
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
// .area-begin{
//   position: absolute;
//   z-index: 1002;
//   left: 0;
//   top: 0;
//   v-show
// }
.ul-content {
  display: none;
  user-select: none;
  // cursor: default;
  color: rgb(136, 133, 133);
  border: 1px solid transparent;
  border-right-color: #5062c2;
  border-bottom-color: #5062c2;
  border-radius: 3px;
  z-index: 101;
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
  .vdr {
    z-index: 1001 !important;
    &.active:before {
      border: 1px dotted #000;
    }
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
  svg {
    position: absolute;
    top: 0;
    z-index: 100;
    // width:100%;
    // height: 100%;
    polygon {
      opacity: 0.2;
    }

    #test:hover {
      opacity: 0.4;
    }
    polygon:hover {
      opacity: 0.4;
    }
  }
}
</style>