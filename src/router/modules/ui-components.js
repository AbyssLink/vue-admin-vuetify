const routes = {
  path: '/ui-components',
  name: 'UIComponents',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'view_module',
  },
  children: [
    {
      path: 'bottom-sheets',
      name: '用户列表',
      component: () => import('@/views/ui-components/VBottomSheets.vue'),
      meta: {},
    },
    {
      path: 'buttons',
      name: '创建商品',
      component: () => import('@/views/ui-components/VButtons.vue'),
      meta: {},
    },
    {
      path: 'cards',
      name: '商品列表',
      component: () => import('@/views/ui-components/VCards.vue'),
      meta: {},
    },
    {
      path: 'carousels',
      name: '商品详情',
      component: () => import('@/views/ui-components/VCarousels.vue'),
      meta: { hidden: true, hasMulSub: false },
    },
    {
      path: 'bottom-navigation',
      name: 'BottomNavigation',
      component: () => import('@/views/ui-components/VBottomNavigation.vue'),
      meta: {},
    },
  ],
};

export default routes;
