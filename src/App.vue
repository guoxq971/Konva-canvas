<template>
  <div id="app">
    <div style="display: flex; justify-content: center" v-show="false">
      <button v-for="item in list" :key="item.path" style="margin-right: 20px; padding: 5px" @click="onClick(item)">{{ item.meta.title }}</button>
    </div>
    <div style="flex: 1">
      <router-view />
    </div>
  </div>
</template>

<script>
import router from '@/router';

export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.list = router.options.routes.filter((e) => e.meta);
  },
  methods: {
    onClick(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
