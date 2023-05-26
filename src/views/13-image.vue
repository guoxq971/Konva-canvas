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

      var imageObj = new Image();
      imageObj.src = url;
      imageObj.onload = function () {
        var yoda = new Konva.Image({
          x: 50,
          y: 50,
          image: imageObj,
          width: 106,
          height: 118,
          draggable: true,
        });

        // add the shape to the layer
        layer.add(yoda);
        layer.batchDraw();
      };

      // 图片
      Konva.Image.fromURL(url, (image) => {
        console.log('image', image);
        image.setAttrs(
          {
            x: clientWidth / 2 - 25,
            y: clientHeight / 2 - 25,
            height: 50, // 图片高度
            width: 50, // 图片宽度
            scaleY: 1, // 图片y轴缩放
            scaleX: 1, // 图片x轴缩放
            draggable: true,
          },
          (err) => console.log(err),
        );

        layer.add(image);
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
