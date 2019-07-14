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
      path: 'top',
      name: '热门图书',
      component: () => import('@/views/ui-components/VBookTop.vue'),
      meta: {},
    },
    {
      path: 'search',
      name: '图书搜索',
      component: () => import('@/views/ui-components/VBookMe.vue'),
      meta: {},
    },
    {
      path: 'rate',
      name: '我的评分',
      component: () => import('@/views/ui-components/VBookRatingMe.vue'),
      meta: {},
    },
    {
      path: 'me',
      name: '我的推荐',
      component: () => import('@/views/ui-components/VBookMe.vue'),
      meta: {},
    },
    {
      path: 'recom',
      name: '图书推荐',
      component: () => import('@/views/ui-components/VBookList.vue'),
      meta: {},
    },
    {
      path: 'detail',
      name: '图书详情',
      component: () => import('@/views/ui-components/VBookDetail.vue'),
      meta: { hidden: true, hasMulSub: false },
    },
  ],
};

export default routes;
