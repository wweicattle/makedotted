<template>
  <div id="app">
    <!-- <HelloWorld /> -->
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/test.vue'

export default {
  name: "app",
  components: {
    // HelloWorld
  },
  created() {
    console.log(this);
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  user-select: none;
}
#app {
  height: 100%;
}
</style>
