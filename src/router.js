import Vue from "vue";
import Router from "vue-router";
import Home from "./views/JobHome.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Search Jobs",
      icon: "el-icon-search",
      component: Home
    },
    {
      path: "/settings",
      name: "JobSettings",
      icon: "el-icon-setting",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/JobSettings.vue")
    },
    {
      path: "/trigger",
      name: "JobTrigger",
      icon: "el-icon-loading",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/JobTrigger.vue")
    }
  ]
});
