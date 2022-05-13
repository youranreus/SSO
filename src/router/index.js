/**
 * @author 季悠然
 * @date 2022-05-13
 */
import {createRouter, createWebHistory} from "vue-router"

const routes = [
    {
        path: '/',
        component: ()=> import('../pages/Index.vue'),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/login',
        component: ()=> import('../pages/Login.vue'),
        meta: {
            title: '登录'
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