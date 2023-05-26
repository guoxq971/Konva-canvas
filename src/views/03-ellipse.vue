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
      // 椭圆
      const ellipse = new Konva.Ellipse({
        x: 200,
        y: 100,
        radiusX: 200,
        radiusY: 100,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
      });
      layer.add(ellipse);
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
