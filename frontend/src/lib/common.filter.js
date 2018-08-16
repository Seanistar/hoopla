import Moment from 'moment'

export default {
  'timestamp': (val) => {
    console.log(val)
    return Moment(val).format('YYYY-MM-DD hh:mm:ss')
  },
  'capitalize': (val) => {
    if (!val) return ''
    val = val.toString()
    return val.charAt(0).toUpperCase() + val.slice(1)
  }
}