import Api from '../common/api.service'

export default {
  getTopics () {
    return Api.get('topics')
  },
  getTopicPage (id) {
    return Api.get(`topics/page/${id}`)
  },
  addTopicInfo (params) {
    return Api.put('topics/add', params)
  },
  editTopicInfo (id, params) {
    return Api.put(`topics/edit/${id}`, params)
  },
  deleteTopic (id) {
    return Api.delete(`topics/${id}`)
  }
}
