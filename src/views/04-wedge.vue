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
      // 楔形
      const wedge = new Konva.Wedge({
        x: 200,
        y: 300,
        radius: 150,
        angle: 45,
        fill: '#ff0000',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
        rotation: 60,
      });
      layer.add(wedge);
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  height: 10%;

  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 42px);
  }
}
</style>
