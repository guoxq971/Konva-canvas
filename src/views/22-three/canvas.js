import Konva from 'konva';
import { config } from '@/views/22-three/data';

// 16位随机字符串uuid
function uuid() {
  return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 初始化canvas
 * */
export class InitCanvas {
  // 画布宽高
  width = config.width;
  height = config.height;
  // 舞台
  stage = null;
  // 图层
  layer = new Konva.Layer();
  // 变换器
  tr = new Konva.Transformer();
  // 当前视图的name
  viewName = '';
  // 当前的视图id
  activeViewId = null;
  // 3d模型
  three = null;

  /**
   * 初始化canvas
   * @param {HTMLElement} container 容器
   * @param {object} opt 参数
   * @param {function} opt.callback 回调函数
   * @param {string} opt.name view的name
   * @param {InitThree} opt.three three实例
   * */
  constructor(container, opt) {
    // 参数
    const param = {
      callback: null,
      name: '', //view的name
      three: null, //three实例
    };
    const _opt = Object.assign(param, opt);
    this.viewName = _opt.name;
    this.three = _opt.three;
    if (container) {
      //画布高宽
      container.width = this.width;
      container.height = this.height;
      const { width, height } = container;

      // 定义画布
      this.stage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
      });
      this.stage.add(this.layer);

      // 组
      this._installGroup();

      // 监听delete键
      this._installDelete();

      // 回调函数
      _opt.callback && _opt.callback(this);
    }
  }

  // 设计图列表
  get imageList() {
    return this.layer.children.filter((e) => {
      // 排除 视图(uv)image
      return ![this.activeViewId].includes(e.attrs.name) && e.className === 'Image';
    });
  }

  // 视图(uv)image
  get view() {
    return this.layer.children.find((e) => e.attrs.name === this.activeViewId);
  }

  // 当前视图中所有设计图的attrs
  get attrs() {
    return this.imageList.map((e) => e.attrs);
  }

  // 更新3d模型对应uv的贴图
  _updateModelMap() {
    if (this.three) {
      this.three.addMap(this.viewName, this.attrs);
    }
  }

  /**
   * 图片移动居中
   * @param {Konva.Image|number} image 图片
   * */
  _imageMoveCenter(image) {
    // 可能是id
    if (typeof image === 'number') image = this._findImageById(image);
    if (!image) return console.error('图片移动居中失败: image is null');
    const { width, height } = image.attrs;
    image.attrs.x = (this.width - width) / 2;
    image.attrs.y = (this.height - height) / 2;
  }

  // delete
  _installDelete() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 46) {
        const selected = this.tr.nodes()[0];
        if (selected) {
          selected.destroy();
          this.tr.nodes([]);
        }
      }
    });
  }

  // 组
  _installGroup() {
    const selectionRect = new Konva.Rect({
      fill: 'rgba(0,0,255,0.1)',
      visible: false,
      stroke: 'rgba(0,0,255,0.5)',
      strokeWidth: 1,
    });
    this.layer.add(selectionRect);
    this.layer.add(this.tr);

    // 鼠标点击
    this.stage.on('click tap', (e) => {
      // console.log('鼠标 点击 click');
      const dom = e.target;
      // 如果是视图的image就跳过
      if (dom.attrs.name === this.activeViewId) return;
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
    // 鼠标按下
    this.stage.on('mousedown touchstart', (e) => {
      // console.log('鼠标 按下 down');
      if (e.target !== this.view) return;
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

    // 鼠标移动
    this.stage.on('mousemove touchmove', (e) => {
      // console.log('鼠标 移动 move');

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

    // 鼠标弹起
    this.stage.on('mouseup touchend', (e) => {
      // console.log('鼠标 抬起 up');
      if (!this.stage) return;

      // 组操作
      if (!selectionRect.visible()) return;
      setTimeout(() => {
        selectionRect.visible(false);
      });
      // 获取所有的设计图
      const shapes = this.imageList;
      // 获取框起来的矩形
      const box = selectionRect.getClientRect();
      // 获取坐标在box内的所有设计图
      let selected = shapes.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
      // 将box内的设计图添加到组中
      this.tr.nodes(selected);
    });
  }

  // 获取最大的zIndex
  _findMaxIndex() {
    const children = this.layer.children;
    const max = children.reduce((prev, curr) => {
      const index = curr.zIndex();
      return index > prev ? index : prev;
    }, 0);
    return max;
  }

  /**
   * 查找设计图根据id
   * @param {number} id 图片id
   * @return {Group | Shape | null}
   * */
  _findImageById(id) {
    const children = this.layer.children;
    const image = children.find((item) => item.attrs.name === id);
    if (!image) {
      console.error(`未找到id为${id}的图片`);
      return null;
    }
    return image;
  }

  /**
   * 添加视图
   * @param {string} url 图片地址
   * @param {object} opt 参数
   * @param {string} opt.name 图片id
   * @param {boolean} opt.isMoveDown 是否置底
   * @param {boolean} opt.isCenter 是否居中
   * @param {function} opt.callback 回调函数
   * @param {function} opt.dragend 拖拽结束回调
   * */
  addView(url, opt = {}) {
    if (this.activeViewId) {
      this.removeImage(this.activeViewId);
    }
    this.activeViewId = opt.name;
    const param = {
      draggable: false,
      isMoveDown: true,
      zIndex: -1,
      name: opt.name,
      isView: true,
    };
    const _opt = Object.assign(param, opt);
    this.addImage(url, _opt);
  }

  /**
   * 添加图片
   * @param {string} url 图片地址
   * @param {object} opt 参数
   * @param {string} opt.name 图片id | 图层id
   * @param {boolean} opt.isMoveDown 是否置底
   * @param {boolean} opt.isCenter 是否居中
   * @param {function} opt.callback 回调函数
   * @param {function} opt.dragend 拖拽结束回调
   * */
  addImage(url, opt = {}) {
    const param = {
      isView: false, // 是否是视图
      draggable: true, // 是否可拖拽
      name: uuid(), // 图片id
      zIndex: this._findMaxIndex() + 1, // 层级
      isMoveDown: false, //是否图片置底
      isCenter: true, // 是否居中
      callback: null, // 回调函数
      dragend: null, // 拖拽结束回调
    };
    const _opt = Object.assign(param, opt);

    const img = new Image();
    img.src = url + `?t=${new Date().getTime()}`;
    // 解决图片跨域问题
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      // 图片的高宽，如果是视图，就是画布的高宽
      const width = _opt.isView ? this.width : img.width;
      const height = _opt.isView ? this.height : img.height;
      const yoda = new Konva.Image({
        name: _opt.name,
        x: 0,
        y: 0,
        image: img,
        width: width,
        height: height,
        draggable: _opt.draggable, // 是否可拖拽
        strokeEnabled: !_opt.isView, // 是否显示边框
        opacity: 1, // 透明度
      });
      this.layer.add(yoda);

      // 图片置底
      if (_opt.isMoveDown) {
        yoda.moveToBottom();
      }
      // this.stage.draw(); // 重绘
      yoda.setZIndex(_opt.zIndex);
      // 图片居中
      if (_opt.isCenter) this._imageMoveCenter(yoda);
      // 回调函数
      _opt.callback && _opt.callback(this, yoda);
      // 更新3d模型对应视图的贴图
      this._updateModelMap();

      // 监听鼠标按下
      yoda.on('mousedown touchstart', (e) => {
        // 设置透明度
        this._setViewOpacity(yoda);
      });
      // 监听鼠标抬起
      yoda.on('mouseup touchend', (e) => {
        // console.log('鼠标 抬起 up');
        // 设置透明度
        this._setViewOpacity(yoda, 'up');
      });
      // 监听点击事件
      yoda.on('click', (e) => {
        // console.log('点击');
      });
      // 监听拖拽事件
      yoda.on('dragstart', (e) => {
        // console.log('拖拽开始');
      });
      yoda.on('dragmove', (e) => {
        // console.log('拖拽中');
      });
      yoda.on('dragend', (e) => {
        // console.log('拖拽结束');
        // 更新3d模型对应视图的贴图
        this._updateModelMap();
      });
      // 监听缩放事件
      yoda.on('transformstart', (e) => {
        /*console.log('缩放开始');*/
      });
      yoda.on('transform', (e) => {
        // console.log('缩放中');
        // _opt.isView && yoda.strokeEnabled(false);
      });
      yoda.on('transformend', (e) => {
        // console.log('缩放结束');
        // 更新3d模型对应视图的贴图
        this._updateModelMap();
      });
      // 监听旋转事件
      yoda.on('rotatestart', (e) => {
        // console.log('旋转开始');
      });
      yoda.on('rotate', (e) => {
        // console.log('旋转中');
        // 更新3d模型对应视图的贴图
        this._updateModelMap();
      });
      yoda.on('rotateend', (e) => {
        // console.log('旋转结束');
        // 更新3d模型对应视图的贴图
        this._updateModelMap();
      });
    };
    img.onerror = () => {
      console.log('图片加载失败');
    };
  }

  /**
   * 移除图片
   * @param {number} id 图片id
   * */
  removeImage(id) {
    this.layer.children = this.layer.children.filter((item) => item.attrs.name !== id);
  }

  // 设计图按下时设置透明度
  _setViewOpacity(img, type = 'down') {
    if (type === 'down') {
      if (img === this.view) return;
      img.opacity(0.6);
    } else {
      img.opacity(1);
    }
  }
}
