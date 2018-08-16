import axios from 'axios'

// const target = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : `http://seanistar.me:3000/api`
const target = 'http://localhost:3000/api'

export default() => {
  return axios.create({
    baseURL: target
  })
}
