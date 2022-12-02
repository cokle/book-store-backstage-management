import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import IndexView from '../views/IndexView.vue'

//配置信息中需要页面的相关配置
const routes = [{
        path: "/",
        component: IndexView
    },
    {
        path: "/login",
        //异步加载，用到时加载
        component: () => import('../views/LoginView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {

    if (null === $cookies.get('username') && to.path !== '/login') {
        return next('/login');
    }

    return next();
})

export default router;