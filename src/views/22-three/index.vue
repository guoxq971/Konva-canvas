<template>
  <div class="main-wrap">
    <div class="chunk-wrap">
      <div class="model-wrap list-wrap">
        <div class="title">模型</div>
        <div class="img-wrap" @click="onClickByModel(item)" v-for="item in modelList" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
      <div class="model-wrap list-wrap">
        <div class="title">设计图</div>
        <div class="img-wrap" @click="onClickByDesign(item)" v-for="item in designList" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
      <div class="view-wrap list-wrap">
        <div class="title">视图</div>
        <div class="img-wrap" @click="onClickByView(item)" v-for="item in viewList" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
      <div class="canvas-wrap" id="canvas-container"></div>
      <div class="three-wrap" id="three-container"></div>
    </div>
  </div>
</template>

<script>
import { designList, modelList, viewList } from './data';
import { InitThree } from '@/views/22-three/three';
import { InitCanvas } from '@/views/22-three/canvas';
export default {
  data() {
    return {
      canvas: null, // 画布
      three: null, // 3d
      modelList, // 模型列表
      viewList, // 视图列表
      designList, // 设计列表
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化three
      this.three = new InitThree(document.getElementById('three-container'), {
        callback: (that) => that.addModel(modelList[0].model_url),
      });
      this.canvas = new InitCanvas(document.getElementById('canvas-container'));
    });
  },
  methods: {
    // design item 点击事件
    onClickByDesign(item) {
      this.canvas.addImage(item.url, { id: item.id });
    },
    // view item 点击事件
    onClickByView(item) {
      this.canvas.addView(item.url, { id: item.id });
    },
    // model item 点击事件
    onClickByModel(item) {
      this.three.addModel(item.model_url);
    },
  },
};
</script>

<style scoped lang="less">
@import './index.less';
</style>
