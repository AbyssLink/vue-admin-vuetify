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
      path: 'me',
      name: '我的订单',
      component: () => import('@/views/ui-components/VOrderMe.vue'),
      meta: {},
    },
    {
      path: 'manage',
      name: '订单管理',
      component: () => import('@/views/ui-components/VOrderManage.vue'),
      meta: {
        auth: ['admin'],
      },
    },
  ],
};

export default routes;
