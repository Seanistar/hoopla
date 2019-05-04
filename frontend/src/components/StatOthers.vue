<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex :class="$parent.window.width >= 900 ? 'xs3' : ['xs6', 'ml-2']">
        <v-combobox label="소속 본당을 선택하세요" class="text-xs-center body-2" clearable
                  :items="churchList" item-value="code" item-text="name"
                  v-model="church"></v-combobox>
      </v-flex>
      <v-flex :class="$parent.window.width >= 900 ? 'xs3' : ['xs6', 'mx-2']">
        <v-combobox label="타 본당을 선택하세요" class="text-xs-center body-2 ml-3" clearable
                    :items="churchList" item-value="code" item-text="name"
                    v-model="other"></v-combobox>
      </v-flex>
      <v-flex text-xs-right v-if="$parent.window.width >= 900">
        <v-btn color="primary" outline @click="toExcel">내려받기</v-btn>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="!fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :items="items" hide-actions
                  style="max-height: calc(80vh - 10px);backface-visibility: hidden;"
                  class="elevation-1 main-table fixed-header v-table__overflow">
      <template slot="headers" slot-scope="props">
        <tr class="first-row">
          <th rowspan="2" class="align-center body-2" style="width: 50px"><p class="head-title">번호</p></th>
          <th rowspan="2" class="align-center body-2"><p class="head-title">성명</p></th>
          <th rowspan="2" class="align-center body-2"><p class="head-title">소속 본당</p></th>
          <th colspan="9" class="align-center subheading"><p class="head-title"><b>봉사 항목</b></p></th>
        </tr>
        <tr class="data-column second-row">
          <th class="align-center body-2" v-for="header in actCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr class="first-column">
          <td class="text-xs-center">{{props.index + 1}}</td>
          <td class="text-xs-center w-10">{{props.item|v_name}}&nbsp;<br/>{{props.item|ca_name}}</td>
          <td class="text-xs-center w-10">{{props.item|s_name}}</td>
          <td class="text-xs-left"
              v-for="at in actCodes" :key="at.code">
              <div class="caption pl-2" v-for="(oa, idx) in orgList(props.item, at.code)" :key="idx">&nbsp;{{oa.a_year}}&nbsp;{{orgActor(oa)}}</div>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="12">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_OTHERS } from '@/store/actions.type'
import { groupBy, orderBy, map, find } from 'lodash/collection'
import { pick } from 'lodash/object'
import FiltersMixin from '../common/filters.mixin'
import XLSX from 'xlsx'

export default {
  name: 'StatOthers',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'smallCodes',
      'statOthers'
    ])
  },
  data: () => ({
    items: [],
    churchList: [],
    church: null,
    other: null,
    fetched: false,
    pagination: { rowsPerPage: 50 },
    perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}]
  }),
  watch: {
    church () {
      this.fetchData()
    },
    other () {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => this.setArea())
  },
  methods: {
    async fetchData () {
      this.fetched = false
      const params = {}
      if (this.church) params['ch_code'] = this.church.code
      if (this.other) params['ot_code'] = this.other.code
      await this.$store.dispatch(FETCH_STAT_OTHERS, {params})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statOthers
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'v_id')
      Object.keys(yg).forEach(k => {
        const vl = pick(yg[k][0], ['v_name', 'ca_name', 's_name'])
        yg[k] = groupBy(yg[k], 'a_code')
        let obj = {}; obj[k] = yg[k]
        Object.assign(obj[k], vl)
        this.items.push(obj)
      })
      this.fetched = true
      // console.log(this.items)
    },
    setArea () {
      const list = map(this.smallCodes(), o => {
        const full = `${o.s_name} (${o.l_name}-${o.m_name})`
        return {code: o.s_code, name: full}
      })
      this.churchList = orderBy(list, ['name'])
    },
    orgList (val, code) {
      const key = Object.keys(val)[0]
      const tar = val[key][code]
      return !Array.isArray(tar) ? null : tar
    },
    orgActor (obj) {
      if (!obj.ot_code) return
      const res = find(this.smallCodes(), (o) => o.s_code === obj.ot_code)
      return res ? res.s_name.slice(0, 3) : ''
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0])
      XLSX.writeFile(wb, 'stats_others.xlsx')
    }
  }
}
</script>

<style scoped>
  .w-5 {
    width: 5% !important;;
  }
</style>
