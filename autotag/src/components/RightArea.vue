<template>
  <div class="right-area">
    <div class="content-detail">
      <span class="title"> Positon</span>
      <div class="text-content">
        <div class="list">
          <div>top</div>
          <input :placeholder="detailData.top" />
        </div>
        <div class="list">
          <div>left</div>
          <input :placeholder="detailData.left" />
        </div>
      </div>
    </div>
    <div class="content-detail">
      <span class="title"> Size</span>
      <div class="text-content">
         <div class="list">
          <div>width</div>
          <input :placeholder="detailData.width" />
        </div>
        <div class="list">
          <div>height</div>
          <input :placeholder="detailData.height" />
        </div>
      </div>
    </div>
    <div class="operate-icon">
      <img src="../assets/addicon.png" alt="" @click="addModelBtn" />
      <img :src="srcDelete" alt="" @click="deleteModelBtn" />
    </div>
    <div class="content-detail">
      <span class="titles"> 基本功能已实现，标记点详情数据可添加。。。</span>
    </div>
  </div>
</template>

<script>
import eventbus from "../utils/evenbus";
let img = require("../assets/delete.png");
let initimg = require("../assets/delete1.png");
export default {
  name: "rightArea",
  data() {
    return {
      srcDelete: initimg,
    };
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    detailData(obj) {
      console.log(obj)
      obj.isopenDel == true
        ? (this.srcDelete = img)
        : (this.srcDelete = initimg);
    },
  },
  methods: {
    addModelBtn() {
      eventbus.$emit("addModel");
    },
    deleteModelBtn() {
      console.log(this.detailData);
      if (this.srcDelete == img) {
        eventbus.$emit("pleaseDelModel");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.right-area {
  padding: 30px 10px 0;
  text-align: left;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  .title {
    font-weight: 600;
  }
  .content-detail {
    padding-bottom: 26px;
    .text-content {
      margin-top: 10px;
      display: flex;
      font-size: 11px;
      color: #bbb;
      font-weight: 300;
      div.list {
        width: 50%;
        padding-left:5px;
      }
      input {
        width: 80px;
        display: inline-block;
        border: 1px solid #bfbfca;
        margin-top: 2px;
        height: 16px;
        margin: 2px 14px 0 4px;
      }
    }
    .titles{
      margin: 0 5px;
      color: #999;
      font-size: 14px;
    }
  }
  .operate-icon {
    text-align: center;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    img {
      padding-left: 15px;
      width: 20px;
    }
  }
}
</style>
