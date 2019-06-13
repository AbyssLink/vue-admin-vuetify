const routes = {
  path: '/order',
  name: 'Order',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'shopping_cart',
  },
  children: [
    {
      path: 'manage',
      name: '订单管理',
      component: () => import('@/views/ui-components/VOrderManage.vue'),
      meta: {},
    },
  ],
};

export default routes;
