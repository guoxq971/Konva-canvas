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

      const url = 'https://img1.baidu.com/it/u=202223273,1086714317&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500';

      Konva.Image.fromURL(url, (image) => {
        image.setAttrs({
          x: clientWidth / 2 - 25,
          y: clientHeight / 2 - 25,
          height: 50,
          width: 50,
          scaleY: 1,
          scaleX: 1,
        });

        layer.add(image);
        const amplitude = 10; // 振幅
        const period = 1000; // 周期
        const y = image.y() - 10; // 原始y坐标
        const animation = new Konva.Animation((frame) => {
          if (!frame) {
            return;
          }
          // y轴坐标 = 振幅 * sin(2π * 时间 / 周期) + 原始y坐标
          image.y(amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + y);
        }, layer);
        // 开始动画
        animation.start();
      });
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
