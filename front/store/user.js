// 全局用户数据管理
import { http } from '~/plugins/axios'

const state = () => ({
  _id: '',
  token: '',
  email: '',
  nickname: '',
  avatar: ''
})

const mutations = {
  SET_USER(state, user = {}) {
    state._id = user._id
    state.email = user.email
    state.nickname = user.nickname
    state.avatar = user.avatar
  },
  SET_TOKEN(state, token) {
    state.token = token
  }
}
const actions = {
  login: async ({ state, commit }, data) => {
    let ret = await http.post('/user/login', data)
    localStorage.setItem('token', ret.data.token)
    commit('SET_TOKEN', ret.data.token)
    return ret
  },
  detail: async ({ state, commit }, data) => {
    let ret = await http.get('/userinfo')
    if (ret.code === 0) {
      commit('SET_USER', ret.data)
      return ret
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
