const FiltersMixin = {
  filters: {
    yearKey (val) {
      const key = Object.keys(val)[0]
      return key === 'null' ? '날짜미상' : key
    },
    yearBy (val) {
      const key = Object.keys(val)[0]
      return val[key]
    },
    counter (val, obj) {
      if (!val[obj.code]) return ''
      return val[obj.code][0].counter
    },
    uv_counter (val, obj) {
      if (!val[obj.code]) return ''
      return val[obj.code][0].uv_count
    },
    gp_counter (val, obj) {
      if (!val[obj.code]) return ''
      return val[obj.code][0].gp_count
    },
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
    },
    front (name) {
      // eslint-disable-next-line
      let [tr, nm] = name.split('-')
      // if (tr.indexOf(' ') > 0) tr = tr.split(' ')[0]
      return tr.trim()
    },
    ch_counter (val, obj) {
      if (!val[obj.a_code]) return '-'
      return val[obj.a_code][0].counter
    }
  }
}

export default FiltersMixin
