const FiltersMixin = {
  filters: {
    yearKey (val) {
      const key = Object.keys(val)[0]
      return key === 'null' ? '날짜미상' : key
    },
    keyBy (val) {
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
    },
    v_name (val) {
      const key = Object.keys(val)[0]
      return val[key].v_name
    },
    ca_name (val) {
      const key = Object.keys(val)[0]
      return val[key].ca_name
    },
    ready (val, code) {
      if (!val[code]) return ''
      const acts = val[code][0]
      return (acts.ready === 'Y') ? '준비중' : acts.a_year
    }
  }
}

export default FiltersMixin
