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

      const tooltip = new Konva.Label({
        x: clientWidth / 2,
        y: clientHeight / 2 - 300,
        draggable: true,
      });

      // 标签tag
      const tag = new Konva.Tag({
        fill: '#ff8800',
        pointerDirection: 'down', // 指针方向
        stroke: 'black',
        strokeWidth: 1,
        pointerWidth: 10, // 指针宽度
        pointerHeight: 10, // 指针高度
        shadowBlur: 10, // 阴影模糊度
        shadowOffsetX: 10, // 阴影x轴偏移量
        shadowOpacity: 0.5, // 阴影透明度
      });

      const tagText = new Konva.Text({
        text: 'Hello World!',
        fontSize: 18,
        padding: 15,
        fill: '#fff',
      });

      tooltip.add(tag);
      tooltip.add(tagText);
      layer.add(tooltip);
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
