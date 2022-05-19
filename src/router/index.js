/**
 * @author 季悠然
 * @date 2022-05-13
 */
import { createRouter, createWebHistory } from "vue-router"
import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Retrieve from "../pages/Retrieve.vue"

const routes = [
  {
    path: '/',
    component: () => import('../pages/Index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/retrieve',
    component: Retrieve,
    meta: {
      title: '找回密码'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = 'SZTU ACM SSO | ' + to.meta.title
  }
  next()
})

export default router