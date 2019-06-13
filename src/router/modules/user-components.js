const routes = {
  path: '/user',
  name: 'User',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'account_circle',
  },
  children: [
    {
      path: 'manage',
      name: '用户管理',
      component: () => import('@/views/ui-components/VUserManage.vue'),
      meta: {},
    },
  ],
};

export default routes;
