import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
  },
  mutations: {
    CHANGE_userInfo: (state, data) => {
      state.userInfo = data
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
