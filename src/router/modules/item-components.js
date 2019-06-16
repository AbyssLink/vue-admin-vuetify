const routes = {
  path: '/item',
  name: 'Item',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'shop',
  },
  children: [
    {
      path: 'list',
      name: '商品页',
      component: () => import('@/views/ui-components/VItemList.vue'),
      meta: {},
    },
    {
      path: 'manage',
      name: '商品管理',
      component: () => import('@/views/ui-components/VItemManage.vue'),
      meta: {
        auth: ['admin'],
      },
    },
    {
      path: 'detail',
      name: '商品详情',
      component: () => import('@/views/ui-components/VItemDetail.vue'),
      meta: { hidden: true, hasMulSub: false },
    },
  ],
};

export default routes;
