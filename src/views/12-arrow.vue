<template>
  <div class="index">
    <div id="canvas"></div>
  </div>
</template>

<script>
import Konva from 'konva';
export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const el = document.getElementById('canvas');
      if (!el) {
        return;
      }

      const { clientWidth, clientHeight } = el;
      const stage = new Konva.Stage({
        container: 'canvas',
        width: clientWidth,
        height: clientHeight,
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      // 箭头
      const arrow = new Konva.Arrow({
        x: clientWidth / 2,
        y: clientHeight / 2,
        points: [0, 0, clientWidth / 4, clientHeight / 4], // 箭头的坐标
        pointerLength: 10, // 箭头长度
        pointerWidth: 10, // 箭头宽度
        stroke: 'black',
        strokeWidth: 5,
      });
      layer.add(arrow);
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;

  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 42px);
  }
}
</style>
