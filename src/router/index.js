import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/auth/TheLogin.vue';
import Register from '@/views/auth/TheRegister.vue';
import Layout from '@/views/layouts/AppLayout.vue';
import LayoutWithoutSidebar from '@/views/layouts/AppLayoutWithoutSidebar.vue';

import itemComponents from './modules/item-components';
import userComponents from './modules/user-components';
import orderComponents from './modules/order-components';
import commentComponents from './modules/comment-components';

Vue.use(Router);

/**
* TIPS:
* meta: {
*   hidden: false,    // If `hidden:true` will not appear in the navigation bar or sidebar(default is false)
*   auth: [],         // It will control the page roles (you can set multiple roles)
*   icon: 'home',     // Icon will appear in the navigation bar or sidebar
*   hasMulSub: false, // It has multiple children
* }
*/
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        hidden: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        hidden: true,
      },
    },
    {
      path: '/',
      redirect: { name: 'Dashboard' },
      meta: {
        hidden: true,
        hasMulSub: false,
      },
    },
    {
      path: '/index',
      name: 'Index',
      component: Layout,
      redirect: { name: 'Dashboard' },
      meta: {
        hidden: false,
        hasMulSub: false,
      },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/TheIndex.vue'),
          meta: {
            icon: 'dashboard',
          },
        },
        itemComponents,
        orderComponents,
        commentComponents,
        userComponents,
        // components,
      ],
    },
    {
      path: '/admin',
      component: LayoutWithoutSidebar,
      redirect: { name: 'Admin' },
      meta: {
        auth: ['admin'],
      },
      children: [
        {
          path: '/admin',
          name: 'Admin',
          component: () => import('@/views/admin/VHomepage.vue'),
          meta: {
            auth: ['admin'],
          },
        },
      ],
    },
    {
      path: '/403',
      meta: {
        hidden: true,
      },
      // redirect: { name: 'Index' },
      component: Login,
    },
    {
      path: '/404',
      meta: {
        hidden: true,
      },
      component: () => import('@/views/error-pages/App404.vue'),
    },
    {
      path: '*',
      redirect: '/404',
      meta: {
        hidden: true,
      },
    },
  ],
});
