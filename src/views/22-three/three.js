import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { obj } from '@/views/21-three/model';
import { config } from '@/views/22-three/data';

/**
 * 初始化three
 * @param {HTMLElement} container 容器
 * @returns {THREE.Scene} 场景
 * */
export class InitThree {
  color = {
    skyblue: 0x87ceeb, // 天蓝色
    white: 0xffffff, // 白色
    gray: 0x808080, // 灰色
  };
  // 渲染区域 高宽
  width = 300;
  height = 700;
  // 场景
  scene = new THREE.Scene();
  // 相机
  camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  // 模型
  model = null;

  constructor(container, opt) {
    // 参数
    const param = {
      callback: null, // 回调函数
    };
    const _opt = Object.assign(param, opt);

    // 场景
    // this.scene.lookAt(0, 0, -1);

    // 相机
    this.camera.position.set(-1, 2, -4.5);

    //渲染器
    this._installRenderer(container);

    // 光源
    this._installLight();

    // 轨道控制器
    this._installControl();

    // 坐标轴
    // this._installAxesHelper();

    // 渲染
    this.render();

    // 回调函数
    _opt.callback && _opt.callback(this);
  }

  /**
   * 生成canvas
   * @param {array} attrs 图片属性集合
   * */
  _createCanvas(attrs) {
    const param = {
      image: null, // 图片对象
      x: 0, // 图片在画布上的x坐标
      y: 0, // 图片在画布上的y坐标
      width: config.width, // 图片宽度
      height: config.height, // 图片高度
      scaleX: 1, // 图片x轴缩放
      scaleY: 1, // 图片y轴缩放
      rotation: 0, // 图片旋转角度
    };
    const _opts = [];
    for (let item of attrs) {
      const opt = Object.assign({ ...param }, item);
      _opts.push(opt);
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = config.width;
    canvas.height = config.height;

    // 填充背景色
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let _opt of _opts) {
      // 宽高
      const width = _opt.width * _opt.scaleX;
      const height = _opt.height * _opt.scaleY;

      // 插入图片
      ctx.drawImage(_opt.image, _opt.x, _opt.y, width, height);
    }

    // 返回画布作为纹理
    return canvas;
  }

  /**
   * 添加颜色贴图
   * @param {string} name 材质名称 (模型中的材质名称, 哪一面)
   * @param {array} opts 参数(创建canvas时的参数 attrs)
   * */
  addMap(name, opts) {
    // 创建纹理
    const texture = new THREE.CanvasTexture(this._createCanvas(opts));
    // 创建材质
    const material = new THREE.MeshStandardMaterial({ map: texture });
    // 添加材质
    if (this.model) {
      // 遍历模型
      this.model.traverse(function (node) {
        // if (node.isMesh && node.material && node.material.name) console.log(node.material.name);
        // 找到对应的材质
        if (node.isMesh && node.material && node.material.name === name) {
          // material.color = new THREE.Color(0, 1, 0);
          node.material = material;
          material.name = name;
          node.material.needsUpdate = true; // 更新材质
        }
      });
    }
  }

  // 渲染器
  _installRenderer(container) {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.color.gray);
    this.renderer.render(this.scene, this.camera);
    container.appendChild(this.renderer.domElement);
  }

  // 坐标轴
  _installAxesHelper() {
    const axesHelper = new THREE.AxesHelper(250);
    this.scene.add(axesHelper);
  }

  // 轨道控制器
  _installControl() {
    // 轨道控制器
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  // 光源
  _installLight() {
    // 点光源
    const light = new THREE.PointLight(this.color.white, 1);
    light.position.set(50, 50, 50);
    this.scene.add(light);
    // // 点光源辅助器
    // const pointLightHelper = new THREE.PointLightHelper(light, 1);
    // this.scene.add(pointLightHelper);
    const light2 = new THREE.PointLight(this.color.white, 1);
    light2.position.set(-50, -50, -50);
    this.scene.add(light2);
    // 环境光
    const ambient = new THREE.AmbientLight(this.color.white, 0.4);
    this.scene.add(ambient);
  }

  // 渲染
  render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  // 添加模型
  addModel(url) {
    const loader = new GLTFLoader();
    this.model = new THREE.Group();
    loader.load(
      url,
      (gltf) => {
        this.model.add(gltf.scene);
        this.scene.add(this.model);
      },
      undefined,
      (error) => {
        console.error('加载模型出现错误！', error);
      },
    );
  }
}
