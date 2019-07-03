const routes = {
  path: '/music',
  name: 'Music',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'music_note',
  },
  children: [
    {
      path: 'list',
      name: '音乐页',
      component: () => import('@/views/ui-components/VMusicList.vue'),
      meta: {},
    },
    {
      path: 'manage',
      name: '歌曲列表',
      component: () => import('@/views/ui-components/VMusicManage.vue'),
      meta: {
        auth: ['admin'],
      },
    },
  ],
};

export default routes;
