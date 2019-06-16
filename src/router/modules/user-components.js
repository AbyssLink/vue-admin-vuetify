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
      path: 'me',
      name: '我自己',
      component: () => import('@/views/ui-components/VUserMe.vue'),
      meta: {},
    },
    {
      path: 'list',
      name: '用户页',
      component: () => import('@/views/ui-components/VUserList.vue'),
      meta: {
        auth: ['admin'],
      },
    },
    {
      path: 'manage',
      name: '用户管理',
      component: () => import('@/views/ui-components/VUserManage.vue'),
      meta: {
        auth: ['admin'],
      },
    },
  ],
};

export default routes;
