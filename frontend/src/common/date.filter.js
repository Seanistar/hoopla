import Moment from 'moment'
import { isNull } from 'lodash/lang'

export default {
  timestamp: (val) => !isNull(val) ? Moment(val).format('YYYY-MM-DD HH:mm:ss') : '',
  datestamp: (val) => !isNull(val) ? Moment(val).format('YYYY-MM-DD') : '',
  yearstamp: (val) => !isNull(val) ? Moment(val).format('YYYY') : ''
}
