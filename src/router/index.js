import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import User from '../components/users/User'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            children: [
                { path: '/home', redirect: '/welcome' },
                { path: '/welcome', component: Welcome },
                { path: '/users', component: User }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next();

})

export default router