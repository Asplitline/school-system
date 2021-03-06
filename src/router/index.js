import Vue from 'vue'
import VueRouter from 'vue-router'

// login
const Login = () => import(/* webpackChunkName: "login_home_admin" */ '@/components/Login.vue')
// home
const Home = () => import(/* webpackChunkName: "login_home_admin" */ '@/components/Home.vue')
const hIndex = () => import(/* webpackChunkName: "home_index" */ '@/components/home/index/Index.vue')
const hPost = () => import(/* webpackChunkName: "home_post" */ '@/components/home/post/Post.vue')
const hAddPost = () => import(/* webpackChunkName: "home_post" */ '@/components/home/post/AddPost.vue')
const hPostDetail = () => import(/* webpackChunkName: "home_post" */ '@/components/home/post/PostDetail.vue')
const hAdvice = () => import(/* webpackChunkName: "home_advice" */ '@/components/home/advice/Advice.vue')
const hDonate = () => import(/* webpackChunkName: "home_donate" */ '@/components/home/donate/Donate.vue')
const hNews = () => import(/* webpackChunkName: "home_news" */ '@/components/home/news/News.vue')
const hNewsDetail = () => import(/* webpackChunkName: "home_news" */ '@/components/home/news/NewsDetail.vue')
const hUser = () => import(/* webpackChunkName: "home_user" */ '@/components/home/user/User.vue')

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
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/index',
    children: [
      { path: '/index', component: hIndex },
      { path: '/post', component: hPost },
      { path: '/post/:id', component: hPostDetail, props: true },
      { path: '/addPost', component: hAddPost },
      { path: '/advice', component: hAdvice },
      { path: '/donate', component: hDonate },
      { path: '/news', component: hNews },
      { path: '/news/:id', component: hNewsDetail, props: true },
      { path: '/user', component: hUser }
    ]
  },
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
      const user = sessionStorage.getItem('userInfo')
      if (user && user !== 'null') {
        next()
      } else { next('/login') }
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
    case '/index':
    case '/post':
    case '/advice':
    case '/donate':
    case '/news':
    case '/user':
      sessionStorage.setItem('currentIndexH', to.path)
      break
  }
  next()
})

export default router
