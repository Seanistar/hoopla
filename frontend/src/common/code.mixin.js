import { uniqBy, concat } from 'lodash/array'
import { filter, find } from 'lodash/collection'
import { startsWith } from 'lodash/string'
// import { isUndefined } from 'lodash/lang'
import { mapGetters } from 'vuex'

const CodeMixin = {
  data: () => ({
    areaCode: {
      la_code: null,
      ma_code: null,
      sa_code: null
    },
    params: { // is equal to bible's column
      area_code: null,
      la_name: '',
      ma_name: '',
      sa_name: ''
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
    'areaCode.la_code' (nv) {
      this.params.area_code = nv
      this.params.la_name = this.getCodeName(nv)
    },
    'areaCode.ma_code' (nv) {
      this.params.area_code = nv
      this.params.ma_name = this.getCodeName(nv)
    },
    'areaCode.sa_code' (nv) {
      this.params.area_code = nv
      this.params.sa_name = this.getCodeName(nv)
    }
  },
  methods: {
    resetCode () {
      this.areaCode.la_code = this.areaCode.ma_code = this.areaCode.sa_code = ''
    },
    assignCode (code) {
      this.resetCode()
      this.areaCode.la_code = code.slice(0, 2)
      this.areaCode.ma_code = code.slice(0, 6)
      this.areaCode.sa_code = code
    },
    changedCode (type, val) {
      // if it needs to use this function. should do overriding on target component
    },
    getCodeName (code) {
      if (!code) return ''
      let res = null
      if (code.length > 6) {
        res = find(this.sAreaCodes, (o) => o.s_code === code)
        if (res && res.s_name) return res.s_name
      } else if (code.length > 2) {
        res = find(this.mAreaCodes, (o) => o.m_code === code)
        if (res && res.m_name) return res.m_name
      } else {
        res = find(this.lAreaCodes, (o) => o.l_code === code)
        if (res && res.l_name) return res.l_name
      }
      return ''
    }
  }
}

export default CodeMixin
