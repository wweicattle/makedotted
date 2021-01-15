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
      <span class="title"> 备注</span>
      <div class="textarea-content">
        <textarea />
      </div>
    </div>
    <div class="content-detail">
      <span class="title"> 图片详情</span>
      <div class="img-content">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
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
      dialogImageUrl: "",
      dialogVisible: false,
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
      console.log(obj);
      obj.isopenDel == true
        ? (this.srcDelete = img)
        : (this.srcDelete = initimg);
    },
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
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

<style  lang="scss">
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
        padding-left: 5px;
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
    .titles {
      margin: 0 5px;
      color: #999;
      font-size: 14px;
    }
    .textarea-content {
      padding: 10px 10px 0;
      textarea {
        width: 190px;
        border: 1px solid #bfbfca;
      }
    }
    .img-content {
      overflow: hidden;
      height: 220px;
      overflow-y: scroll;
      padding: 12px;
      &::-webkit-scrollbar {
        // 滚动条的背景
        width: 16px;
        background: #fff;
        height: 14px;
      }

      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        border-radius: 999px;
        width: 20px;
        border: 5px solid transparent;
      }

      &::-webkit-scrollbar-track {
        box-shadow: 1px 1px 5px #fff;
      }

      &::-webkit-scrollbar-thumb {
        //滚动条的滑块样式修改
        width: 20px;
        min-height: 20px;
        background-clip: content-box;
        box-shadow: 0 0 0 5px #999 inset;
      }
      .el-upload {
        width: 80px;
        height: 80px;
        position: relative;
        i {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          margin: auto;
        }
      }
      .el-upload-list {
        li {
          width: 80px;
          height: 80px;
        }
      }
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
