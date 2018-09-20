import { mapGetters } from 'vuex'
import { QUERY_VOLUNTEER_ITEM } from '@/store/actions.type'
import { groupBy } from 'lodash/collection'

const QueryMixin = {
  computed: {
    ...mapGetters([
      'ebsCodes',
      'trnCodes', // bible train
      'actCodes',
      'stdCodes', // check notes
      'queryInfo',
      'queriedVoltItems'
    ])
  },
  data: () => ({
    items: [],
    e_type: 'E'
  }),
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const vID = this.queryInfo.good.id
      // console.log(vID, this.e_type)
      await this.$store.dispatch(QUERY_VOLUNTEER_ITEM, {e_type: this.e_type, v_id: vID})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.queriedVoltItems
      if (!qv) return

      const yg = groupBy(qv, 'e_year')
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        let obj = {}; obj[k] = yg[k]
        this.items.push(obj)
      })
      this.items.reverse()
    }
  },
  filters: {
    yearKey (val) {
      return Object.keys(val)[0]
    },
    yearBy (val) {
      const key = Object.keys(val)[0]
      return val[key]
    },
    counter (val, obj) {
      if (!val[obj.code]) return '-'
      return val[obj.code][0].counter
    },
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
    }
  }
}

export default QueryMixin
