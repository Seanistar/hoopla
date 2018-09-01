import { uniqBy, concat } from 'lodash/array'
import { filter } from 'lodash/collection'
import { startsWith } from 'lodash/string'
import { mapGetters } from 'vuex'

const CodeMixin = {
  data: () => ({
    areaCode: {
      la_code: null,
      ma_code: null,
      sa_code: null
    },
    params: { // is equal to bible's column
      area_code: null
    }
  }),
  computed: {
    ...mapGetters([
      'areaCodes'
    ]),
    lAreaCodes () {
      let init = [{l_name: '선택없음', l_code: ''}]
      return concat(init, uniqBy(this.areaCodes, 'l_code'))
    },
    mAreaCodes () {
      let init = [{m_name: '선택없음', m_code: ''}]
      let rest = filter(uniqBy(this.areaCodes, 'm_code'), (o) => startsWith(o.a_code, `${this.areaCode.la_code}-`))
      return concat(init, rest)
    },
    sAreaCodes () {
      let init = [{s_name: '선택없음', s_code: ''}]
      let rest = filter(uniqBy(this.areaCodes, 's_code'), (o) => startsWith(o.a_code, `${this.areaCode.ma_code}`))
      return concat(init, rest)
    }
  },
  watch: {
    'areaCode.la_code' (nv, ov) {
      if (ov === null) return this.onSelect('L', nv)
      this.params.area_code = nv
      this.areaCode.ma_code = this.areaCode.sa_code = ''
      this.onSelect('L', nv)
    },
    'areaCode.ma_code' (nv, ov) {
      if (ov === null) return
      this.params.area_code = nv
      this.areaCode.sa_code = ''
      this.onSelect('M', nv)
    },
    'areaCode.sa_code' (nv, ov) {
      if (ov === null) return
      this.params.area_code = nv
      this.onSelect('S', nv)
    }
  },
  methods: {
    resetCode () {
      this.areaCode.la_code = this.areaCode.ma_code = this.areaCode.sa_code = ''
    },
    assignCode (code) {
      this.areaCode.la_code = code.slice(0, 2)
      this.areaCode.ma_code = code.slice(0, 6)
      this.areaCode.sa_code = code
    }
  }
}

export default CodeMixin
