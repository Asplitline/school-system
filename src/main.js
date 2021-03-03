import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element ui
import './plugins/element'
// css
import './assets/css/global.css'
// function
import '@/plugins/function'
// icon
import '@/assets/fonts/iconfont.css'
Vue.config.productionTip = false
// quill
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
// highlight 
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/stackoverflow-light.css'  //导入代码高亮样式
Vue.directive('highlight', function (el) {
  let highlight = el.querySelectorAll('pre.ql-syntax');
  highlight.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
