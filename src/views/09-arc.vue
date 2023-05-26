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

      // 弧形
      const arc = new Konva.Arc({
        x: clientWidth / 2,
        y: clientHeight / 2,
        innerRadius: 40, //内半径
        outerRadius: 70, //外半径
        angle: 60, //角度
        fill: '#ff8800',
        stroke: 'black',
        strokeWidth: 1,
        rotation: 60, //旋转角度
      });
      layer.add(arc);
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
