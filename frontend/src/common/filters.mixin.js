const FiltersMixin = {
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

export default FiltersMixin
