import Konva from 'konva';

/**
 * 初始化canvas
 * */
export class InitCanvas {
  stage = null; // 舞台
  layer = new Konva.Layer(); // 图层
  tr = new Konva.Transformer(); // 变换器

  activeViewId = null; // 当前选中的视图id

  constructor(container) {
    if (container) {
      container.width = 1024;
      container.height = 1024;
      const { width, height } = container;
      this.stage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
      });
      this.stage.add(this.layer);

      // 组
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
      // 鼠标按下
      this.stage.on('mousedown touchstart', (e) => {
        // console.log('鼠标 down');
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

      // 鼠标移动
      this.stage.on('mousemove touchmove', (e) => {
        // console.log('鼠标 move');

        // 组操作
        if (!selectionRect.visible()) return;
        const { x, y } = stage?.getPointerPosition();
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
        // console.log('鼠标 up');
        if (!this.stage) return;
        // imgChange();

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

      // 监听delete键
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
  }

  // 获取最大的zIndex
  findMaxIndex() {
    const children = this.layer.children;
    const max = children.reduce((prev, curr) => {
      const index = curr.zIndex();
      return index > prev ? index : prev;
    }, 0);
    return max;
  }

  // 添加视图
  addView(url, opt = {}) {
    if (this.activeViewId) {
      this.removeImage(this.activeViewId);
    }
    this.activeViewId = opt.id;
    const param = { draggable: false, isMoveDown: true };
    const _opt = Object.assign(param, opt);
    this.addImage(url, _opt);
  }

  // 添加图片
  addImage(url, opt = {}) {
    const param = {
      draggable: true,
      id: '',
      zIndex: this.findMaxIndex() + 1,
      isMoveDown: false, //是否图片置底
    };
    const _opt = Object.assign(param, opt);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const yoda = new Konva.Image({
        name: _opt.id,
        x: 0,
        y: 0,
        image: img,
        width: width,
        height: height,
        draggable: _opt.draggable,
      });
      this.layer.add(yoda);
      if (_opt.isMoveDown) yoda.moveDown(); // 图片置底
      // this.stage.draw(); // 重绘
      yoda.setZIndex(_opt.zIndex);
    };
    img.onerror = () => {
      console.log('图片加载失败');
    };
  }

  // 移除图片
  removeImage(id) {
    const node = this.layer.children.find((item) => item.attrs.name === id);
    if (node) node.destroy();
  }
}
