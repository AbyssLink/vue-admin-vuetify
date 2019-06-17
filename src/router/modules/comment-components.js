const routes = {
  path: '/comment',
  name: 'Comment',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'comment',
  },
  children: [
    {
      path: 'me',
      name: '我的评论',
      component: () => import('@/views/ui-components/VCommentMe.vue'),
      meta: {},
    },
    {
      path: 'manage',
      name: '评论管理',
      component: () => import('@/views/ui-components/VCommentManage.vue'),
      meta: {
        auth: ['admin'],
      },
    },
  ],
};

export default routes;
