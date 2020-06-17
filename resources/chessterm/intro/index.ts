import Vue from "vue"
import VueRouter from "vue-router"
import { BootstrapVue } from "bootstrap-vue"

// @ts-ignore
import Index from "./pages/Index"
// @ts-ignore
import Intro from "./pages/Intro"
// @ts-ignore
import GetStarted from "./pages/GetStarted"
// @ts-ignore
import Register from "./pages/Register"

Vue.use(VueRouter)
Vue.use(BootstrapVue)

const routes = [
  { path: '/', component: Intro },
  { path: '/use', component: GetStarted },
  { path: "/register/thhs", component: Register }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(Index)
}).$mount("#app")
