import Api from './Api'

export default {
  getTopics () {
    return Api().get('topics')
  },
  getTopicPage (id) {
    return Api().get(`topics/page/${id}`)
  },
  addTopicInfo (params) {
    return Api().put('topics/add', params)
  }
}
