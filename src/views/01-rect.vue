<template>
  <div class="index">
    <div id="canvas"></div>
  </div>
</template>

<script>
import Konva from 'konva';
export default {
  methods: {
    init() {
      // 获取dom元素
      const el = document.getElementById('canvas');
      if (!el) {
        return;
      }
      // 获取dom元素的宽高
      const { clientWidth, clientHeight } = el;
      // 画布
      const stage = new Konva.Stage({
        container: 'canvas', //渲染到某个ID上
        width: clientWidth, //画布宽
        height: clientHeight, //画布高
      });
      //图层
      const layer = new Konva.Layer();
      // 添加到画布中
      stage.add(layer);
      // 矩形
      const width = 400; //宽
      const height = 200; // 高
      const x = clientWidth / 2 - width / 2; //使图形x轴居中显示
      const y = clientHeight / 2 - height / 2; //使图形y轴居中显示

      // 矩形
      const rect = new Konva.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: '#ff8800',
        stroke: 'black',
        strokeWidth: 1,
      });
      layer.add(rect);
    },
  },
  mounted() {
    this.init();
  },
};
// 初始化
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: 100%;
  }
}
</style>
