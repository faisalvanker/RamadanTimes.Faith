
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') },-->
      { path: '', component: () => import('pages/TimeTable.vue') },
      { path: 'Tasbeeh', component: () => import('pages/Tasbeeh.vue') },
      { path: 'Settings', component: () => import('pages/Settings.vue') },
      { path: 'Contact', component: () => import('pages/Contact.vue') },
      { path: 'About', component: () => import('pages/About.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
