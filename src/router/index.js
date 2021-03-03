import Vue from 'vue'
import VueRouter from 'vue-router'

// login
const Login = () => import(/* webpackChunkName: "login_home_admin" */ '@/components/Login.vue')
// home
const Home = () => import(/* webpackChunkName: "login_home_admin" */ '@/components/Home.vue')

// admin
const Admin = () => import(/* webpackChunkName: "login_home_admin" */ '@/components/Admin.vue')
const Advice = () => import(/* webpackChunkName: "admin_advice" */ '@/components/admin/advice/Advice.vue')
const Comment = () => import(/* webpackChunkName: "admin_comment" */ '@/components/admin/comment/Comment.vue')
const Donate = () => import(/* webpackChunkName: "admin_donate" */ '@/components/admin/donate/Donate.vue')
const Log = () => import(/* webpackChunkName: "admin_log" */ '@/components/admin/log/Log.vue')
const News = () => import(/* webpackChunkName: "admin_news" */ '@/components/admin/news/News.vue')
const HandleNews = () => import(/* webpackChunkName: "admin_news" */ '@/components/admin/news/HandleNews.vue')
const Post = () => import(/* webpackChunkName: "admin_post" */ '@/components/admin/post/Post.vue')
const User = () => import(/* webpackChunkName: "admin_user" */ '@/components/admin/user/User.vue')

Vue.use(VueRouter)
const routes = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    redirect: '/_user',
    children: [
      { path: '/_user', component: User },
      { path: '/_advice', component: Advice },
      { path: '/_comment', component: Comment },
      { path: '/_donate', component: Donate },
      { path: '/_log', component: Log },
      { path: '/_news', component: News },
      { path: '/_hNews', component: HandleNews },
      { path: '/_hNews/:id', component: HandleNews, props: true },
      { path: '/_post', component: Post }
    ],
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem('userInfo')) next()
      else next('/login')
    }
  },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  switch (to.path) {
    case '/_user':
    case '/_advice':
    case '/_comment':
    case '/_donate':
    case '/_log':
    case '/_news':
    case '/_post':
      sessionStorage.setItem('currentIndexA', to.path)
      break
  }
  next()
})

export default router
