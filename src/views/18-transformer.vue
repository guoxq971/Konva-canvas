<template>
  <div class="index">
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
      tr: new Konva.Transformer(), // 变换器
    };
  },
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
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: clientWidth,
        height: clientHeight,
      });

      this.stage.add(this.layer);

      const rect1 = new Konva.Rect({
        name: 'rect',
        x: clientWidth / 2 - 100,
        y: clientHeight / 2,
        width: 200,
        height: 100,
        fill: '#ff8800',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
      });
      this.layer.add(rect1);

      const rect2 = new Konva.Rect({
        name: 'rect',
        x: clientWidth / 2 + 100,
        y: clientHeight / 2,
        width: 200,
        height: 100,
        fill: '#ff00ff',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true,
      });
      this.layer.add(rect2);

      const selectionRect = new Konva.Rect({
        fill: 'rgba(0,0,255,0.1)',

        visible: false,
        stroke: 'rgba(0,0,255,0.5)',
        strokeWidth: 1,
      });
      this.layer.add(selectionRect);
      this.layer.add(this.tr);

      this.stage.on('click tap', (e) => {
        const dom = e.target;
        if (dom.getType() === 'Shape') {
          this.tr.nodes([dom]);
        } else {
          this.tr.nodes([]);
        }
      });
      let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;
      this.stage.on('mousedown touchstart', (e) => {
        if (e.target !== this.stage) {
          return;
        }
        e.evt.preventDefault();
        const { x, y } = this.stage.getPointerPosition();
        x1 = x;
        x2 = x;
        y1 = y;
        y2 = y;
        selectionRect.visible(true);
        selectionRect.width(0);
        selectionRect.height(0);
      });

      this.stage.on('mousemove touchmove', (e) => {
        if (!selectionRect.visible()) {
          return;
        }
        const { x, y } = this.stage?.getPointerPosition();
        x2 = x;
        y2 = y;
        selectionRect.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x1 - x2),
          height: Math.abs(y1 - y2),
        });
      });

      this.stage.on('mouseup touchend', (e) => {
        if (!this.stage) {
          return;
        }
        if (!selectionRect.visible()) {
          return;
        }
        setTimeout(() => {
          selectionRect.visible(false);
        });
        const shapes = this.stage.find('.rect');
        const box = selectionRect.getClientRect();
        let selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        this.tr.nodes(selected);
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
