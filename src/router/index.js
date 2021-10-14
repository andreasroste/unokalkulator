import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Start from "../views/Start.vue";
import Spill from "../views/Spill.vue";
import Admin from "../views/Admin.vue";
import Statistikk from "../views/Statistikk.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/start",
    name: "Start",
    component: Start
  },
  {
    path: "/spill",
    name: "Spill",
    component: Spill
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin
  },
  {
    path: "/statistikk",
    name: "statistikk",
    component: Statistikk
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
