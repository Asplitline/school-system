import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(sessionStorage.getItem('userInfo')),
    currentNews: JSON.parse(sessionStorage.getItem('currentNews')),
    currentPost: JSON.parse(sessionStorage.getItem('currentPost')),
    loginStatus: sessionStorage.getItem('loginStatus') === 'true',
    menuIndex: sessionStorage.getItem('menuIndex')
  },
  mutations: {
    initUser (state, data) {
      sessionStorage.setItem('userInfo', JSON.stringify(data))
      state.user = data
    },
    initCurrentNews (state, data) {
      sessionStorage.setItem('currentNews', JSON.stringify(data))
      state.currentNews = data
    },
    initCurrentPost (state, data) {
      sessionStorage.setItem('currentPost', JSON.stringify(data))
      state.currentPost = data
    },
    initLoginStatus (state, data) {
      sessionStorage.setItem('loginStatus', data === true)
      state.loginStatus = data === true
    },
    initMenuIndex (state, data) {
      sessionStorage.setItem('menuIndex', data)
      state.menuIndex = data
    }
  },
  actions: {
  },
  modules: {
  }
})
