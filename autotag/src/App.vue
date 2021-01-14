<template>
  <div id="app" >
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view  />
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  created() {
    window.onresize = function () {
      // window.location.reload()
    };
  },
};
</script>
<style>
body,
html {
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #ececec;
  min-width: 570px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
