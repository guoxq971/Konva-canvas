export const config = {
  width: 1024 / 2,
  height: 1024 / 2,
  // 画布大小
  canvas_size: { width: 500, height: 500, unit: 'px' },
};

// view 视图
export const viewList = [
  { id: 1, url: './uv/正面-透明.png', name: '前面', dpi: 72, size: { width: 1024, height: 1024, unit: 'px' } },
  { id: 2, url: './uv/背面-透明.png', name: '背面', dpi: 72, size: { width: 1024, height: 1024, unit: 'px' } },
];

// model 模型
export const modelList = [
  { id: 11, url: 'https://picsum.photos/100/100', model_url: './衣服.glb' },
  { id: 22, url: 'https://picsum.photos/100/100', model_url: './衣服.glb' },
];

// design 设计
export const designList = [
  { id: 111, url: 'https://picsum.photos/100/100', dpi: '' },
  { id: 222, url: 'https://picsum.photos/100/100', dpi: '' },
  { id: 333, url: './test.jpg', dpi: 72, size: { width: 1080, height: 1080, unit: 'px' } },
  // { id: 444, url: './test2.jpg', dpi: 300, size: { width: 25630, height: 18307, unit: 'px' } },
];
