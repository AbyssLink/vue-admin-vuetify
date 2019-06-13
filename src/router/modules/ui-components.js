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
      path: 'bottom-navigation',
      name: '商品页',
      component: () => import('@/views/ui-components/VBottomNavigation.vue'),
      meta: {},
    },
    {
      path: 'cards',
      name: '商品管理',
      component: () => import('@/views/ui-components/VCards.vue'),
      meta: {},
    },
    {
      path: 'chips',
      name: '订单管理',
      component: () => import('@/views/ui-components/VChips'),
      meta: {},
    },
    {
      path: 'bottom-sheets',
      name: '用户管理',
      component: () => import('@/views/ui-components/VBottomSheets.vue'),
      meta: {},
    },
    { // 代更改
      path: 'carousels',
      name: '商品详情',
      component: () => import('@/views/ui-components/VCarousels.vue'),
      meta: { hidden: true, hasMulSub: false },
    },
  ],
};

export default routes;
