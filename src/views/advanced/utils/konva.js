import Konva from 'konva';
import { componentShapeType } from './consts';

export class KonvaJS {
  id;
  SCALE_BY;
  stage;
  layer;
  tr;
  group;

  constructor(id) {
    this.id = id;
    this.SCALE_BY = 1.1;
    this.stage = null;
    this.layer = this.newLayer();
    this.tr = this.newTransformer();
    this.group = this.newGroup({ x: 0, y: 0 });
    this.init();
  }
  init() {
    const el = document.getElementById(this.id);
    if (!el) {
      return;
    }
    const { clientWidth, clientHeight } = el;
    this.stage = this.newStage({
      container: this.id,
      width: clientWidth,
      height: clientHeight,
      draggable: false,
      type: componentShapeType.CANVAS,
    });
    this.layer.add(this.group);
    this.layer.add(this.tr);
    this.stage.add(this.layer);
    this.drawBoard();
    this.addListenerStageEvents();
  }
  addListenerStageEvents() {
    const { stage } = this;
    if (!stage) {
      return;
    }
    stage.on('wheel', (e) => {
      if (!stage) {
        return;
      }
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      let direction = e.evt.deltaY > 0 ? -1 : 1;
      if (e.evt.ctrlKey) {
        direction = -direction;
      }
      const newScale = direction > 0 ? oldScale * this.SCALE_BY : oldScale / this.SCALE_BY;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    });
  }

  drawBoard() {
    if (!this.stage) {
      return;
    }
    const width = 800;
    const height = 500;
    const x = this.stage.width() / 2 - width / 2;
    const y = this.stage.height() / 2 - height / 2;
    const board = this.newRect({
      id: this.getUUID(),
      title: '画板',
      name: 'board',
      x: x,
      y: y,
      width: width,
      height: height,
      fill: '#ffffff',
      type: componentShapeType.BOARD,
      stroke: '#ffffff',
      strokeWidth: 1,
      opacity: 1,
      create: true,
      scaleX: 1,
      scaleY: 1,
    });
    this.group.add(board);
  }
  drawShapes(type, position) {
    if (!this.stage) {
      return;
    }
    let shapes;
    const id = this.getUUID();
    if (type === componentShapeType.RECT) {
      const allShapes = this.stage.find('.rect');
      shapes = this.newRect({
        id: id,
        title: `矩形${allShapes.length + 1}`,
        name: 'rect',
        width: 200,
        height: 100,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        draggable: true,
        type: type,
        opacity: 1,
        create: true,
        scaleX: 1,
        scaleY: 1,
      });
    } else if (type === componentShapeType.PARALLELOGRAM) {
      const allShapes = this.stage.find('.parallelogram');
      shapes = this.newRect({
        id: id,
        title: `平行四边形${allShapes.length + 1}`,
        name: 'parallelogram',
        width: 200,
        height: 100,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        draggable: true,
        skewX: -0.5,
        type: type,
        opacity: 1,
        create: true,
        scaleX: 1,
        scaleY: 1,
      });
    } else if (type === componentShapeType.RHOMBUS) {
      const allShapes = this.stage.find('.rhombus');
      shapes = new Konva.RegularPolygon({
        id: id,
        title: `菱形${allShapes.length + 1}`,
        sides: 4,
        radius: 100,
        name: 'rhombus',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        draggable: true,
        type: type,
        opacity: 1,
        create: true,
        scaleX: 1,
        scaleY: 1,
      });
    }
    if (!shapes) {
      return;
    }
    shapes.position(position);
    this.group.add(shapes);
    return shapes;
  }
  onresize() {
    const el = document.getElementById(this.id);
    if (!el) {
      return;
    }
    const { clientWidth, clientHeight } = el;
    this.stage?.setAttrs({
      width: clientWidth,
      height: clientHeight,
    });
  }
  getUUID() {
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  newStage(data) {
    return new Konva.Stage(data);
  }
  newLayer() {
    return new Konva.Layer();
  }
  newTransformer() {
    return new Konva.Transformer();
  }
  newGroup(data) {
    return new Konva.Group(data);
  }
  newRect(data) {
    return new Konva.Rect(data);
  }
  newCircle(data) {
    return new Konva.Circle(data);
  }
  newText(data) {
    return new Konva.Text(data);
  }
  newRegularPolygon(data) {
    return new Konva.RegularPolygon(data);
  }
  newLine(data) {
    return new Konva.Line(data);
  }
  newLabel(data) {
    return new Konva.Label(data);
  }
  newTag(data) {
    return new Konva.Tag(data);
  }
  newArrows(data) {
    return new Konva.Arrow(data);
  }
  newPath(data) {
    return new Konva.Path(data);
  }
}
