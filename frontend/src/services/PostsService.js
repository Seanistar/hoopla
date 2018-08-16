import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api.get('posts')
  },
  addPost (params) {
    return Api.post('posts/add', params)
  },
  updatePost (params) {
    return Api.put(`posts/update/${params.id}`, params)
  },
  getPost (params) {
    return Api.get('posts/page/' + params.id)
  },
  deletePost (id) {
    return Api.delete('posts/delete/' + id)
  },
  uploadFile (forms) {
    return Api.post('posts/upload', forms)
  }
}
