import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/:id/view',
      name: 'view',
      component: () => import('@/views/View.vue'),
    },
    {
      path: '/:id/control',
      name: 'control',
      component: () => import('@/views/Control.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
    },
  ],
})

export default router
