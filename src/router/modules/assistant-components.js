const routes = {
  path: '/assistant',
  name: 'Assistant',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'assistant',
  },
  children: [
    {
      path: 'todo/me',
      name: '我的待办',
      component: () => import('@/views/ui-components/VTodoMe.vue'),
      meta: {},
    },
    {
      path: 'todo/manage',
      name: '待办管理',
      component: () => import('@/views/ui-components/VTodoManage.vue'),
      meta: {},
    },
  ],
};

export default routes;
