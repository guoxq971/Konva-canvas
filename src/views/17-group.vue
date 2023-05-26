<template>
  <div class="index">
    <div class="header">
      <button @click="moveToTop">置顶</button>
      <button @click="moveToBottom">置底</button>
      <button @click="moveUp">上移一层</button>
      <button @click="moveDown">下移一层</button>
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
      group: new Konva.Group(), // 组
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    moveToTop() {
      if (!this.stage) {
        return;
      }
      const shapes = this.stage.findOne('#rect0');
      shapes.moveToTop();
    },

    moveToBottom() {
      if (!this.stage) {
        return;
      }
      const shapes = this.stage.findOne('#rect0');
      shapes.moveToBottom();
    },

    moveDown() {
      if (!this.stage) {
        return;
      }
      const shapes = this.stage.findOne('#rect0');
      shapes.moveDown();
    },
    moveUp() {
      if (!this.stage) {
        return;
      }
      const shapes = this.stage.findOne('#rect0');
      shapes.moveUp();
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
      this.group.setAttrs({
        x: clientWidth / 2,
        y: clientHeight / 2,
        draggable: true,
      });
      const colors = ['#ff8800', '#ff0000', '#ff00ff', '#00ffff'];
      for (let i = 0; i < 4; i++) {
        const rect = new Konva.Rect({
          id: `rect${i}`,
          name: 'testName',
          x: i * 20,
          y: i * 20,
          width: 100,
          height: 50,
          fill: colors[i],
          stroke: 'black',
          strokeWidth: 1,
          draggable: true,
        });
        this.group.add(rect);
      }
      this.layer.add(this.group);
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
