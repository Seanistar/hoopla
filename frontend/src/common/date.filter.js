import Vue from 'vue'
import Moment from 'moment'
import { isNull } from 'lodash/lang'

const DateFilter = {
  timestamp: (val) => !isNull(val) ? Moment(val).format('YYYY-MM-DD HH:mm:ss') : '',
  datestamp: (val) => !isNull(val) ? Moment(val).format('YYYY-MM-DD') : '',
  monthstamp: (val) => !isNull(val) ? Moment(val).format('YYYY-MM') : '',
  yearstamp: (val) => !isNull(val) ? Moment(val).format('YYYY') : ''
}

export default DateFilter

Vue.filter('timestamp', DateFilter['timestamp'])
Vue.filter('datestamp', DateFilter['datestamp'])
Vue.filter('monthstamp', DateFilter['monthstamp'])
Vue.filter('yearstamp', DateFilter['yearstamp'])
