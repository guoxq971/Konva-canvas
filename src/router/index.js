import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/01-rect',
  },
  {
    path: '/01-rect',
    name: '01-rect',
    meta: { title: '01-矩形' },
    component: () => import('@/views/01-rect.vue'),
  },
  {
    path: '/02-circle',
    name: '02-circle',
    meta: { title: '02-圆' },
    component: () => import('@/views/02-circle.vue'),
  },
  {
    path: '/03-ellipse',
    name: '03-ellipse',
    meta: { title: '03-椭圆' },
    component: () => import('@/views/03-ellipse.vue'),
  },
  {
    path: '/04-wedge',
    name: '04-wedge',
    meta: { title: '04-楔形' },
    component: () => import('@/views/04-wedge.vue'),
  },
  {
    path: '/05-line',
    name: '05-line',
    meta: { title: '05-线' },
    component: () => import('@/views/05-line.vue'),
  },
  {
    path: '/06-text',
    name: '06-text',
    meta: { title: '06-文本' },
    component: () => import('@/views/06-text.vue'),
  },
  {
    path: '/07-star',
    name: '07-star',
    meta: { title: '07-星星' },
    component: () => import('@/views/07-star.vue'),
  },
  {
    path: '/08-ring',
    name: '08-ring',
    meta: { title: '08-环形' },
    component: () => import('@/views/08-ring.vue'),
  },
  {
    path: '/09-arc',
    name: '09-arc',
    meta: { title: '09-弧形' },
    component: () => import('@/views/09-arc.vue'),
  },
  {
    path: '/10-label',
    name: '10-label',
    meta: { title: '10-标签tag' },
    component: () => import('@/views/10-label.vue'),
  },
  {
    path: '/11-regularPolygon',
    name: '11-regularPolygon',
    meta: { title: '11-正多边形' },
    component: () => import('@/views/11-regularPolygon.vue'),
  },
  {
    path: '/12-arrow',
    name: '12-arrow',
    meta: { title: '12-箭头' },
    component: () => import('@/views/12-arrow.vue'),
  },
  {
    path: '/13-image',
    name: '13-image',
    meta: { title: '13-图片' },
    component: () => import('@/views/13-image.vue'),
  },
  {
    path: '/14-animation',
    name: '14-animation',
    meta: { title: '14-动画' },
    component: () => import('@/views/14-animation.vue'),
  },
  {
    path: '/15-showHide',
    name: '15-showHide',
    meta: { title: '15-显示隐藏' },
    component: () => import('@/views/15-showHide.vue'),
  },
  {
    path: '/16-keyEvents',
    name: '16-keyEvents',
    meta: { title: '16-快捷键' },
    component: () => import('@/views/16-keyEvents.vue'),
  },
  {
    path: '/17-group',
    name: '17-group',
    meta: { title: '17-组、图层' },
    component: () => import('@/views/17-group.vue'),
  },
  {
    path: '/18-transformer',
    name: '18-transformer',
    meta: { title: '18-平移、旋转、缩放' },
    component: () => import('@/views/18-transformer.vue'),
  },
  {
    path: '/19-wheel',
    name: '19-wheel',
    meta: { title: '19-缩放画布' },
    component: () => import('@/views/19-wheel.vue'),
  },
  {
    path: '/20-preview',
    name: '20-preview',
    meta: { title: '20-小图预览' },
    component: () => import('@/views/20-preview.vue'),
  },
  {
    path: '/advanced',
    name: 'advanced',
    meta: { title: '案例' },
    component: () => import('@/views/advanced'),
  },
  {
    path: '/21-three',
    name: '21-three',
    meta: { title: '3d' },
    component: () => import('@/views/21-three/index.vue'),
  },
  {
    path: '/22-three',
    name: '22three',
    meta: { title: '3d-2' },
    component: () => import('@/views/22-three/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
