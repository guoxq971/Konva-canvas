import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const img = new Image();
img.src = './test.jpg';
const width = 1080; //8.8457 * 10;
const height = 1080; //34.4699 * 10;
// const gui = new GUI();
export const obj = {
  initPosition: {},
  dx: 0,
  dy: 0,
  dw: width,
  dh: height,
  x: 0,
  y: 0,
  ratate: 0,
  width: width,
  height: height,
  bgc: '#ffffff',
};
// gui.add(obj, 'x', -width, width).name('x').onChange(change);
// gui.add(obj, 'y', -height, height).name('y').onChange(change);
// gui.add(obj, 'ratate', -Math.PI, Math.PI).name('ratate').onChange(change);
// gui.addColor(obj, 'bgc').name('bgc').onChange(change);
// gui.add(obj, 'width', 0, width).name('width').onChange(change);
// gui.add(obj, 'height', 0, height).name('height').onChange(change);
// gui.add(obj, 'dx', -width, width).name('dx').onChange(change);
// gui.add(obj, 'dy', -height, height).name('dy').onChange(change);
// gui.add(obj, 'dw', 0, width * 2).name('dw').onChange(change);
// gui.add(obj, 'dh', 0, height * 2).name('dh').onChange(change);

// 修改模型数据
export function change() {
  img.width = obj.width;
  img.height = obj.height;
  const texture = new THREE.CanvasTexture(createCanvas());
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const name = '前面';
  // const name = 'Clothing_SYD0043_B_scale30&30_custom.002';
  if (model.children.length) {
    const mesh = model.children[0].children[0].children.find((e) => e.material.name === name);
    mesh.material = material;
    material.name = name;
    mesh.material.needsUpdate = true;
  }
}

// 图片居中
export function center() {
  obj.dx = (width - obj.width) / 2;
  obj.dy = (height - obj.height) / 2;
  obj.initPosition.x = obj.dx;
  obj.initPosition.y = obj.dy;
  change();
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  // 填充背景色
  ctx.fillStyle = obj.bgc;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 插入图片
  ctx.drawImage(img, obj.dx, obj.dy, obj.width, obj.height);
  // 返回画布作为纹理
  return canvas;
}

const loader = new GLTFLoader();
const model = new THREE.Group();
loader.load('./衣服-2.glb', (gltf) => {
  // console.log(gltf);
  model.add(gltf.scene);
  change();
});

export default model;
