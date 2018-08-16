import Api from '@/services/Api'

export default {
  getAuthors () {
    return Api.get('authors')
  }
}
