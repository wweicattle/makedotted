<template>
  <div>
    {{ name }}-{{ age }}
    {{ sum }}
    <!-- <el-button @click="btn">you btn?</el-button> -->
    <button @click="btn"></button>
    <button @click="btns"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "zheng",
      age: 50,
      sum: 100,
    };
  },
  created() {},
  mounted() {},
  methods: {
    btn() {
      console.log("you btn!");
      this.sum = ++this.sum;
    },
    btns() {
      console.log("you btn!");
      this.sum = --this.sum;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
