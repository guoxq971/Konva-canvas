import Konva from 'konva';
import { config } from '@/views/22-three/data';
import { Message } from 'element-ui';

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
  width = config.canvas_size.width;
  height = config.canvas_size.height;
  // 舞台
  stage = null;
  // 设计图-图层
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
      callback: null, //回调函数
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

  /**
   * 添加视图
   * @param {string} url 图片地址
   * @param {object} opt 参数
   * @param {string} opt.name 图片id
   * @param {boolean} opt.isMoveDown 是否置底
   * @param {boolean} opt.isCenter 是否居中
   * @param {function} opt.callback 回调函数
   * */
  addView(url, opt = {}) {
    // 当前视图id
    this.activeViewId = opt.name;
    // 初始化图片
    const img = new Image();
    img.src = url;
    // 解决图片跨域问题
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      // 初始化图片
      const yoda = new Konva.Image({
        name: this.activeViewId,
        x: 0,
        y: 0,
        image: img,
        width: this.width,
        height: this.height,
        draggable: false, // 是否可拖拽
        strokeEnabled: false, // 是否显示边框
      });
      this.layer.add(yoda); // 添加到图层
      yoda.moveToBottom(); // 置底
      this.layer.draw(); // 重绘
    };
    img.onerror = (err) => console.log(err);
  }

  /**
   * 添加图片
   * @param {string} url 图片地址
   * @param {object} opt 参数
   * @param {string|number} opt.name 图片id | 图层id
   * @param {boolean} opt.isMoveDown 是否置底
   * @param {boolean} opt.isCenter 是否居中
   * @param {function} opt.callback 回调函数
   * @param {object} opt.detail 图片详情
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
      detail: {}, // 图片详情
    };
    const _opt = Object.assign(param, opt);

    const img = new Image();
    img.src = url + `?t=${new Date().getTime()}`;
    // 解决图片跨域问题
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      // 获取图片宽高
      const { width, height } = this._dispose_imageSize(_opt);

      if (!width || !height) {
        Message.warning('图片宽高计算错误');
        return;
      }

      // 是否显示边框
      let strokeEnabled = true;
      if (_opt.isView) {
        strokeEnabled = false;
      }

      // 初始化图片
      const yoda = new Konva.Image({
        name: _opt.name,
        x: 0,
        y: 0,
        image: img,
        width: width,
        height: height,
        draggable: _opt.draggable, // 是否可拖拽
        strokeEnabled: strokeEnabled, // 是否显示边框
        // opacity: 1, // 透明度
        detail: _opt, // 图片详情
        globalCompositeOperation: 'multiply', //'darken', // 图片混合模式
      });
      this.layer.add(yoda);

      // 设置层级
      yoda.setZIndex(_opt.zIndex);
      // 图片置底
      if (_opt.isMoveDown) yoda.moveToBottom();
      // 图片居中
      if (_opt.isCenter) this._imageMoveCenter(yoda);
      // 更新3d模型对应视图的贴图
      this._updateModelMap();
      // 图片的监听事件
      this._installImageOn(yoda);
      // 回调函数
      _opt.callback && _opt.callback(this, yoda);
      // 重新渲染
      this.layer.draw();
    };
    img.onerror = () => {
      console.log('图片加载失败');
    };
  }

  /**
   * 移除图片
   * @param {number|null} id 图片id
   * */
  removeImage(id) {
    this.layer.children = this.layer.children.filter((item) => item.attrs.name !== id);
  }

  /**
   * 获取设计图和画布的比例
   * @param {object} img 图片的mm
   * @param {number} img.width 图片的宽度
   * @param {number} img.height 图片的高度
   * @return {object} result 返回比例
   * @return {number} result.widthRatio 宽度比例
   * @return {number} result.heightRatio 高度比例
   * @return {object} result.ratio 宽高比例
   * @return {number} result.ratio.width 宽度比例
   * @return {number} result.ratio.height 高度比例
   * @return {object} result.size 宽高比例
   * @return {number} result.size.width 宽度比例
   * @return {number} result.size.height 高度比例
   * @private
   * */
  _getRatio(img) {
    const imageSize = img;
    const printAreaSize = {
      width: this.width,
      height: this.height,
    };
    // 宽高的比例
    let widthRatio;
    let heightRatio;
    if (imageSize.width > printAreaSize.width) {
      widthRatio = printAreaSize.width / imageSize.width;
    } else {
      widthRatio = 1;
    }
    if (imageSize.height * widthRatio > printAreaSize.height) {
      heightRatio = printAreaSize.height / (imageSize.height * widthRatio);
    } else {
      heightRatio = 1;
    }

    return {
      widthRatio: +widthRatio.toFixed(2),
      heightRatio: +heightRatio.toFixed(2),
      ratio: {
        width: +widthRatio.toFixed(2),
        height: +heightRatio.toFixed(2),
      },
      size: {
        width: +(imageSize.width * widthRatio * heightRatio).toFixed(2),
        height: +(imageSize.height * widthRatio * heightRatio).toFixed(2),
      },
    };
  }

  /**
   * 处理图片的高宽
   * @param {object} _opt 参数
   * @param {object} _opt.detail 图片的详细信息
   * @param {boolean} _opt.isView 是否是视图
   * @return {object} result 返回比例
   * @return {number} result.width 宽度
   * @return {number} result.height 高度
   * @private
   * */
  _dispose_imageSize(_opt) {
    // 图片的高宽，如果是视图，就是画布的高宽
    // TODO: ①这里的 width 和 height 是【设计图】的高宽(原始)。
    // TODO: ②需要根据【设计图】的高宽和画布的高宽，计算出缩放比例
    // TODO: ③这里只计算【设计图】和画布之间的宽高关系，设计图贴合到模型上的关系，需要在three.js中计算
    let width, height;
    // 如果是视图
    if (_opt.isView) {
      width = this.width;
      height = this.height;
    }
    // 非视图
    else {
      const imgDetail = _opt.detail;
      if (imgDetail.dpi) {
        // 获取图片的mm
        const mm = {
          width: this._px2mm(imgDetail.size.width, imgDetail.dpi),
          height: this._px2mm(imgDetail.size.height, imgDetail.dpi),
        };
        console.log('mm', mm);
        // 获取图片和画布的比例
        const result = this._getRatio(mm);
        console.log('result', result);
        width = result.size.width;
        height = result.size.height;
      } else {
        width = _opt.isView ? this.width : img.width;
        height = _opt.isView ? this.height : img.height;
      }
    }
    return {
      width,
      height,
    };
  }

  /**
   * 像素转mm
   * - 1mm = 25.4px
   * - dpi越大, 图片越清晰,但是图片越小
   * @param {number} px 像素
   * @param {number} dpi dpi
   * @return {number} mm
   * @private
   * */
  _px2mm(px, dpi) {
    return +((25.4 * px) / dpi).toFixed(2);
  }

  /**
   * 设计图按下时设置透明度
   * @param {Konva.Image} img 图片
   * @param {string} type 操作类型 up | down
   * @private
   * */
  _setViewOpacity(img, type = 'down') {
    if (type === 'down') {
      if (img === this.view) return;
      img.opacity(0.6);
    } else {
      img.opacity(1);
    }
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
   * @private
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
        // selected = 选中的设计图
        const selected = this.tr.nodes()[0];
        if (selected) {
          selected.destroy();
          this.tr.nodes([]);
          this._updateModelMap();
        }
      }
    });
  }

  /**
   * 组
   * @private
   * */
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
    this.stage.on('mousemove touchmove', () => {
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
    this.stage.on('mouseup touchend', () => {
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
    return children.reduce((prev, curr) => {
      const index = curr.zIndex();
      return index > prev ? index : prev;
    }, 0);
  }

  /**
   * 查找设计图根据id
   * @param {number} id 图片id
   * @return {Group | Shape | null}
   * @private
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
   * 加载图片的时候初始化的图片监听事件
   * @param {Konva.Image} yoda 图片
   * @private
   * */
  _installImageOn(yoda) {
    // 监听鼠标按下
    yoda.on('mousedown touchstart', () => {
      // 设置透明度
      // this._setViewOpacity(yoda);
    });
    // 监听鼠标抬起
    yoda.on('mouseup touchend', () => {
      // console.log('鼠标 抬起 up');
      // 设置透明度
      this._setViewOpacity(yoda, 'up');
    });

    // 监听点击事件
    yoda.on('click', () => {
      // console.log('点击');
    });

    // 监听拖拽事件
    yoda.on('dragstart', () => {
      // console.log('拖拽开始');
    });
    yoda.on('dragmove', () => {
      // console.log('拖拽中');
    });
    yoda.on('dragend', () => {
      // console.log('拖拽结束');
      // 更新3d模型对应视图的贴图
      this._updateModelMap();
    });

    // 监听缩放事件
    yoda.on('transformstart', () => {
      /*console.log('缩放开始');*/
    });
    yoda.on('transform', () => {
      // console.log('缩放中');
      // _opt.isView && yoda.strokeEnabled(false);
    });
    yoda.on('transformend', () => {
      // console.log('缩放结束');
      // 更新3d模型对应视图的贴图
      this._updateModelMap();
    });

    // 监听旋转事件
    yoda.on('rotatestart', () => {
      // console.log('旋转开始');
    });
    yoda.on('rotate', () => {
      // console.log('旋转中');
      // 更新3d模型对应视图的贴图
      this._updateModelMap();
    });
    yoda.on('rotateend', () => {
      // console.log('旋转结束');
      // 更新3d模型对应视图的贴图
      this._updateModelMap();
    });
  }
}
