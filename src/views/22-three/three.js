import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
  // 宽度
  width = 300;
  // 高度
  height = 700;
  // 场景
  scene = new THREE.Scene();
  // 相机
  camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  constructor(container, opt) {
    const param = {
      callback: () => {},
    };
    const _opt = Object.assign(param, opt);

    // 场景
    // this.scene.lookAt(0, 0, -1);

    // 相机
    this.camera.position.set(-1, 2, -4.5);

    //渲染器
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(this.color.gray);
    this.renderer.render(this.scene, this.camera);
    container.appendChild(this.renderer.domElement);

    // 光源
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

    // 轨道控制器
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // 坐标轴
    // const axesHelper = new THREE.AxesHelper(250);
    // this.scene.add(axesHelper);

    // 渲染
    this.render();

    // 回调函数
    _opt.callback && _opt.callback(this);
  }

  // 渲染
  render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  // 添加模型
  addModel(url) {
    const loader = new GLTFLoader();
    const model = new THREE.Group();
    loader.load(
      url,
      (gltf) => {
        model.add(gltf.scene);
        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('加载模型出现错误！', error);
      },
    );
  }
}
