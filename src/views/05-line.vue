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
      // 线、曲线、闭合
      const line = new Konva.Line({
        points: [100, 100, 200, 300, 500, 400], //[x1,y1,x2,y2...]
        stroke: 'red',
        strokeWidth: 2,
        closed: true,
        fill: 'red',
        tension: 0.5, // 值越大，拉伸越大
      });
      layer.add(line);
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
