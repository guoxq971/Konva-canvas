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
      // 星星
      const star = new Konva.Star({
        x: clientWidth / 2,
        y: clientHeight / 2 - 100,
        numPoints: 5, //点数
        innerRadius: 50, //内半径
        outerRadius: 100, //外半径
        fill: '#ff8800',
        stroke: 'black',
        strokeWidth: 1,
      });
      layer.add(star);
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  padding: 20px;

  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 42px);
  }
}
</style>
