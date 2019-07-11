const routes = {
  path: '/book',
  name: 'Book',
  component: {
    template: '<router-view></router-view>',
  },
  meta: {
    hasMulSub: true,
    hidden: false,
    icon: 'book',
  },
  children: [
    {
      path: 'me',
      name: '图书推荐',
      component: () => import('@/views/ui-components/VBookList.vue'),
      meta: {},
    },
  ],
};

export default routes;
