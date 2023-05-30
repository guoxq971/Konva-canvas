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
          <el-badge is-dot :hidden="viewDot(item.name)">
            <img :src="item.url" alt="" />
          </el-badge>
        </div>
      </div>
      <div class="canvas-wrap">
        <div v-show="item.name === activeView" v-for="(item, index) in viewList" :id="`canvas-container-${index + 1}`"></div>
      </div>
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
      activeView: null, // 当前视图
      canvasList: [], // 画布列表
      three: null, // 3d
      modelList, // 模型列表
      viewList, // 视图列表
      designList, // 设计列表
    };
  },
  mounted() {
    this.$nextTick(() => {
      const threeContainer = document.getElementById('three-container');
      // 初始化three
      this.three = new InitThree(threeContainer, {
        callback: (that) => that.addModel(modelList[0].model_url),
      });

      for (let i = 0; i < this.viewList.length; i++) {
        const view = this.viewList[i];
        // 初始化canvas
        const canvasContainer = document.getElementById(`canvas-container-${i + 1}`);
        const canvas = new InitCanvas(canvasContainer, {
          callback: (that) => that.addView(view.url, { name: view.id }),
          name: view.name,
        });
        this.canvasList.push(canvas);
      }
      this.activeView = this.canvasList[0].name;
    });
  },
  computed: {
    viewDot() {
      return (name) => {
        const canvas = this.canvasList.find((item) => item.name === name);
        return !(canvas && canvas.imageList.length > 0);
      };
    },
    curCanvas() {
      return this.canvasList.find((item) => item.name === this.activeView);
    },
  },
  methods: {
    // 设计图 item 点击事件
    onClickByDesign(item) {
      this.curCanvas.addImage(item.url, {
        id: item.id,
        callback: (that, img, attrs) => {
          this.three.addMap(this.activeView, attrs);
        },
        dragend: (that, img, attrs) => {
          this.three.addMap(this.activeView, attrs);
        },
      });
    },
    // 视图 item 点击事件
    onClickByView(item) {
      this.activeView = item.name;
      this.curCanvas.addView(item.url, { name: item.id });
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
