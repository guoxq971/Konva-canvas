<template>
  <div class="index">
    <div class="model-wrap"></div>
    <div id="canvas"></div>
    <div class="three-wrap" ref="threeBox"></div>
  </div>
</template>

<script>
import Konva from 'konva';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import model, { obj, change, center } from './model';
export default {
  data() {
    return {
      stage: null, // 画布
      layer: new Konva.Layer(), // 图层
      tr: new Konva.Transformer(), // 变换器
    };
  },
  methods: {
    init() {
      // 记录初始位置
      const initPosition = {};
      const imgChange = () => {
        const target = this.layer.children.find((e) => e.attrs.name === 'test');
        if (!target) return;
        console.log('图', JSON.parse(JSON.stringify(target)));
        console.log('initPosition', initPosition);
        console.log('this.layer', this.layer);
        const { x, y, width, height, scaleX, scaleY } = target.attrs;
        // 图片当前的位置
        const sx = scaleX || 1;
        const sy = scaleY || 1;
        const dx = x - initPosition.x + obj.initPosition.x;
        const dy = y - initPosition.y + obj.initPosition.y;
        const w = width;
        const h = height;
        obj.dx = dx;
        obj.dy = dy;
        obj.width = w * sx;
        obj.height = h * sy;
        console.log('model obj', obj);
        change();
      };
      const el = document.getElementById('canvas');
      if (!el) return;
      const { clientWidth, clientHeight } = el;
      this.stage = new Konva.Stage({
        container: 'canvas',
        width: clientWidth,
        height: clientHeight,
      });
      this.stage.add(this.layer);

      // 图片
      const imageObj = new Image();
      imageObj.src = './test.jpg';
      imageObj.onload = () => {
        const width = imageObj.width / 3;
        const height = imageObj.height / 3;
        const yoda = new Konva.Image({
          name: 'test',
          x: clientWidth / 2 - width / 2,
          y: clientHeight / 2 - height / 2,
          image: imageObj,
          width: width,
          height: height,
          draggable: true,
        });
        this.layer.add(yoda);
        initPosition.x = yoda.attrs.x;
        initPosition.y = yoda.attrs.y;
        initPosition.width = yoda.attrs.width;
        initPosition.height = yoda.attrs.height;

        // 初始化模型
        this.threeInit();
      };

      const uvObj = new Image();
      uvObj.src = './uv.png';
      uvObj.onload = () => {
        const width = uvObj.width / 1.3;
        const height = uvObj.height / 1.3;
        const yoda = new Konva.Image({
          x: clientWidth / 2 - width / 2,
          y: clientHeight / 2 - height / 2,
          image: uvObj,
          width: width,
          height: height,
          draggable: false,
        });
        this.layer.add(yoda);
        yoda.moveDown();
      };

      // 组
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
        console.log('鼠标 down');
        if (e.target !== this.stage) return;
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
        // console.log('鼠标 move');

        // 组操作
        if (!selectionRect.visible()) return;
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
        console.log('鼠标 up');
        if (!this.stage) return;
        imgChange();

        // 组操作
        if (!selectionRect.visible()) return;
        setTimeout(() => {
          selectionRect.visible(false);
        });
        const shapes = this.stage.find('.rect');
        const box = selectionRect.getClientRect();
        let selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
        this.tr.nodes(selected);
      });
    },
    threeInit() {
      const color = {
        skyblue: 0x87ceeb, // 天蓝色
        white: 0xffffff, // 白色
        gray: 0x808080, // 灰色
      };
      const width = 300;
      const height = 700;
      // 场景
      const scene = new THREE.Scene();
      // 相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(-1, 2, -4.5);
      //渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.setClearColor(color.gray);
      renderer.render(scene, camera);
      this.$refs.threeBox.appendChild(renderer.domElement);

      // 物体
      scene.add(model);
      this.modelInitAfter();

      // 坐标轴
      const axesHelper = new THREE.AxesHelper(250);
      // scene.add(axesHelper);
      // 光源
      // 点光源
      const light = new THREE.PointLight(color.white, 1);
      light.position.set(50, 100, 60);
      scene.add(light);
      // 点光源辅助器
      const pointLightHelper = new THREE.PointLightHelper(light, 1);
      scene.add(pointLightHelper);
      // 环境光
      const ambient = new THREE.AmbientLight(color.white, 0.4);
      scene.add(ambient);
      // 轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);

      // 渲染
      function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();
    },
    // 模型初始化后
    modelInitAfter() {
      console.log(this.layer.children);
      const target = this.layer.children.find((e) => e.attrs.name === 'test');
      if (!target) return;
      const { x, y, width, height } = target.attrs; // 图片当前的位置
      // const dx = x - initPosition.x;
      // const dy = y - initPosition.y;
      const w = width;
      const h = height;
      // obj.dx = dx;
      // obj.dy = dy;
      obj.width = w;
      obj.height = h;
      change();
      center();
      // console.log(x, y, width, height);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
// 初始化
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  display: flex;
  border: 1px solid #666;
  .model-wrap {
    width: 200px;
    height: 100%;
    background-color: #fff;
  }
  #canvas {
    margin: 0 30px;
    flex: 1;
    background-color: #eee;
    border: 1px solid #666;
    height: 100%;
  }
  .three-wrap {
    width: 350px;
    height: 100%;
    background-color: #fff;
  }
}
</style>
