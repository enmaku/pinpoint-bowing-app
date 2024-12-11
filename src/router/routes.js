const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'games', component: () => import('pages/GamesPage.vue') },
      { path: 'games/create', component: () => import('pages/GamesCreate.vue') },
      { path: 'bowlers', component: () => import('pages/BowlersPage.vue') },
      { path: 'profile', component: () => import('pages/ErrorNotFound.vue') },
      { path: 'stats', component: () => import('pages/ErrorNotFound.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
