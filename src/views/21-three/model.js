import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let model;
const img = new Image();
img.src = './test.jpg';
const width = 1080; //8.8457 * 10;
const height = 1080; //34.4699 * 10;
const name = '前面';
// const name = '背面'; //后面
// const name = '右袖';
// const name = '左袖';
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
  bgc: 'red',
};

// 修改模型数据
export function change() {
  img.width = obj.width;
  img.height = obj.height;
  const texture = new THREE.CanvasTexture(createCanvas());
  const material = new THREE.MeshStandardMaterial({ map: texture });
  if (model) {
    model.traverse(function (node) {
      if (node.isMesh && node.material && node.material.name === name) {
        // material.color = new THREE.Color(0, 1, 0);
        node.material = material;
        material.name = name;
        node.material.needsUpdate = true;
      }
    });
  }
}

export function find() {
  let mesh;
  // const name = 'Clothing_SYD0043_B_scale30&30_custom.002';
  if (model.children.length) {
    // mesh = model.children[0].children[0].children.find((e) => e.material.name === name);
    model.traverse(function (node) {
      if (node.isMesh && node.material && node.material.name === name) {
        mesh = node;
      }
    });
  }
  // mesh.geometry.boundingSphere
  return mesh;
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

  // console.log('img', [img], obj);
  // 插入图片
  ctx.drawImage(img, obj.dx, obj.dy, obj.width, obj.height);
  // 返回画布作为纹理
  return canvas;
}

export function initModel(scene, cb) {
  const loader = new GLTFLoader();
  model = new THREE.Group();
  loader.load('./衣服.glb', (gltf) => {
    // console.log('gltf.scene', gltf.scene);
    model.add(gltf.scene);
    change();
    scene.add(model);
    cb && cb(gltf.scene);
  });
}

// export default model;
