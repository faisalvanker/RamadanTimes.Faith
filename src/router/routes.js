const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/TimeTable.vue") },
      { path: "Tasbeeh", component: () => import("pages/Tasbeeh.vue") },
      { path: "Settings", component: () => import("pages/Settings.vue") },
      { path: "Contact", component: () => import("pages/Contact.vue") },
      { path: "About", component: () => import("pages/About.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
