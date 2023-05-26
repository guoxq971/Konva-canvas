<template>
  <div class="index">
    <div class="header">
      <button @click="show">展示</button>
      <button @click="hide">隐藏</button>
    </div>
    <div id="canvas"></div>
  </div>
</template>

<script>
import Konva from 'konva';
export default {
  data() {
    return {
      stage: null, // 画布
      layer: new Konva.Layer(), // 图层
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    show() {
      if (!this.stage) {
        return;
      }
      // const shapes = stage.findOne("#testId")
      // const shapes = stage.findOne(".testName")
      const shapes = this.stage.findOne('Rect');
      shapes.show();
    },
    hide() {
      if (!this.stage) {
        return;
      }
      const shapes = this.stage.findOne('Rect');
      shapes.hide();
    },
    init() {
      const el = document.getElementById('canvas');
      if (!el) {
        return;
      }
      const { clientWidth, clientHeight } = el;
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: clientWidth,
        height: clientHeight,
      });

      this.stage.add(this.layer);
      // 矩形
      const width = 400;
      const height = 200;
      const x = clientWidth / 2 - width / 2;
      const y = clientHeight / 2 - height / 2;
      const rect = new Konva.Rect({
        id: 'testId',
        name: 'testName',
        x: x,
        y: y,
        width: width,
        height: height,
        fill: '#ff8800',
        stroke: 'black',
        strokeWidth: 1,
        opacity: 0.5, // 0~1
      });
      this.layer.add(rect);

      const container = this.stage.container();
      const step = 10;
      container.tabIndex = 1;
      container.focus();
      container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          rect.x(rect.x() - step);
        } else if (e.key === 'ArrowDown') {
          rect.y(rect.y() + step);
        } else if (e.key === 'ArrowRight') {
          rect.x(rect.x() + step);
        } else if (e.key === 'ArrowUp') {
          rect.y(rect.y() - step);
        } else {
          return;
        }
        e.preventDefault();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;

  .header {
    height: 50px;
  }

  #canvas {
    background-color: #eee;
    border: 1px solid #666;
    height: calc(100vh - 92px);
  }
}
</style>
