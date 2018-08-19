import Moment from 'moment'

export default (val) => {
  return Moment(val).format('YYYY-MM-DD HH:mm:ss')
}
