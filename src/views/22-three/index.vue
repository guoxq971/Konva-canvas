<template>
  <div class="main-wrap">
    <div class="chunk-wrap">
      <!--模型-->
      <div class="model-wrap list-wrap">
        <div class="title">模型</div>
        <div class="img-wrap" @click="onClickByModel(item)" v-for="item in modelList" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
      <!--设计图-->
      <div class="model-wrap list-wrap">
        <div class="title">设计图</div>
        <div class="img-wrap" @click="onClickByDesign(item)" v-for="item in designList" :key="item.id">
          <img :src="item.url" alt="" />
        </div>
      </div>
      <!--视图-->
      <div class="view-wrap list-wrap">
        <div class="title">视图</div>
        <div class="img-wrap" @click="onClickByView(item)" v-for="item in viewList" :key="item.id">
          <el-badge is-dot :hidden="viewDot(item.name)">
            <img :src="item.url" alt="" />
          </el-badge>
        </div>
      </div>
      <!--画布-->
      <div class="canvas-wrap">
        <div v-show="item.name === activeViewName" v-for="(item, index) in viewList" :id="`canvas-container-${index + 1}`"></div>
      </div>
      <!--three-->
      <div class="three-wrap" id="three-container"></div>
    </div>
  </div>
</template>

<script>
import { designList, modelList, viewList } from './data';
import { InitThree } from '@/views/22-three/three';
import { InitCanvas } from '@/views/22-three/canvas';
import * as dat from 'dat.gui';
export default {
  data() {
    return {
      activeViewName: null, // 当前视图name
      canvasList: [], // 画布列表
      three: null, // 3d
      modelList, // 模型列表
      viewList, // 视图列表
      designList, // 设计列表
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化three
      const threeContainer = document.getElementById('three-container');
      this.three = new InitThree(threeContainer, {
        callback: (that) => that.addModel(modelList[0].model_url),
      });

      // 初始化canvas
      for (let i = 0; i < this.viewList.length; i++) {
        const view = this.viewList[i];
        const canvasContainer = document.getElementById(`canvas-container-${i + 1}`);
        const canvas = new InitCanvas(canvasContainer, {
          callback: (that) => that.addView(view.url, { name: view.id }),
          name: view.name,
          three: this.three,
        });
        this.canvasList.push(canvas);
      }
      // 默认激活第一个视图
      this.activeViewName = this.canvasList[0].viewName;

      const gui = new dat.GUI();
      gui
        .addColor(this.three, 'primaryColor')
        .name('模型颜色')
        .onChange(() => {
          this.three._updateMap();
          this.canvasList.forEach((item) => item._updateModelMap());
        });
    });
  },
  computed: {
    // 视图是否有图片 true-有 false-无
    viewDot() {
      return (name) => {
        const canvas = this.canvasList.find((item) => item.viewName === name);
        return !(canvas && canvas.imageList.length > 0);
      };
    },
    // 当前激活视图的canvas
    curCanvas() {
      return this.canvasList.find((item) => item.viewName === this.activeViewName);
    },
  },
  methods: {
    // 设计图 item 点击事件
    onClickByDesign(item) {
      this.curCanvas?.addImage(item.url, { detail: item });
    },
    // 视图 item 点击事件
    onClickByView(item) {
      this.activeViewName = item.name;
    },
    // 模型 item 点击事件
    onClickByModel(item) {
      this.three.addModel(item.model_url);
    },
  },
};
</script>

<style scoped lang="less">
@import './index.less';
</style>
