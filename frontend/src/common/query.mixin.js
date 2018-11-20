import { mapGetters } from 'vuex'
import { QUERY_VOLUNTEER_ITEM } from '@/store/actions.type'
import { groupBy } from 'lodash/collection'
import FiltersMixin from '../common/filters.mixin'

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
  mixins: [ FiltersMixin ],
  props: {
    v_id: null
  },
  data: () => ({
    items: [],
    e_type: 'Y'
  }),
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      let vID = this.queryInfo.good.id
      if (!vID) vID = this.v_id
      // console.log(vID, this.e_type, this.v_id)
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
  }
}

export default QueryMixin
