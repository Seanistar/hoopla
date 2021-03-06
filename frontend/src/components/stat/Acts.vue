<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex :class="$parent.window.width >= 900 ? 'xs3' : ['xs6', 'ml-2']">
        <v-combobox label="본당을 선택하세요" class="text-xs-center body-2" clearable
                  :items="churchList" item-value="code" item-text="name"
                  v-model="church"></v-combobox>
      </v-flex>
      <v-flex :class="$parent.window.width >= 900 ? 'xs9' : 'xs6'" text-xs-right>
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
          <!--<th rowspan="2" class="align-center body-2"><p class="head-title">번호</p></th>-->
          <th rowspan="2" class="align-center body-2" style="width: 120px"><p class="head-title">성명</p></th>
          <th rowspan="2" class="align-center body-2" style="width: 50px"><p class="head-title">구분</p></th>
          <th colspan="10" class="align-center subheading"><p class="head-title"><b>항목</b></p></th>
        </tr>
        <tr class="data-column second-row">
          <th class="align-center body-2" v-for="header in actCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr class="first-column">
          <!--<td rowspan="2" class="text-xs-center w-5">{{props.index + 1}}</td>-->
          <td rowspan="2" class="text-xs-center w-10">&nbsp;{{props.item|v_name}}&nbsp;<br/>{{props.item|ca_name}}</td>
          <td>노트</td>
          <td class="text-xs-left"
              v-for="at in stdCodes" :key="at.code"><span class="caption pl-2">{{props.item|keyBy|ready(at.code)}}</span>
          </td>
        </tr>
        <tr>
          <td style="background-color: unset">봉사</td>
          <td class="text-xs-left"
              v-for="at in actCodes" :key="at.code">
              <div class="caption pl-2" v-for="(oa, idx) in orgList(props.item, at.code)" :key="idx">{{oa.a_year}}&nbsp;{{otherActor(oa)}}</div>
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
import { FETCH_STAT_ACTS } from '@/store/actions.type'
import { groupBy, orderBy, map, find } from 'lodash/collection'
import { pick } from 'lodash/object'
import FiltersMixin from '../../common/filters.mixin'
import XLSX from 'xlsx'

export default {
  name: 'StatActs',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'stdCodes',
      'smallCodes',
      'statActs'
    ])
  },
  data: () => ({
    items: [],
    churchList: [],
    fetched: false,
    church: { code: '01-10-01', name: '가락동' }
  }),
  watch: {
    church (nv) {
      if (!nv) {
        this.items = []
        return
      }
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => this.setArea())
  },
  methods: {
    async fetchData () {
      if (!this.church || !this.church.code) return
      this.fetched = false
      const params = {}
      if (this.church) params['code'] = this.church.code
      await this.$store.dispatch(FETCH_STAT_ACTS, {params})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statActs
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'v_id')
      Object.keys(yg).forEach(k => {
        const vl = pick(yg[k][0], ['v_name', 'ca_name'])
        yg[k] = groupBy(yg[k], 'a_code')
        let obj = {}; obj[k] = yg[k]
        Object.assign(obj[k], vl)
        this.items.push(obj)
      })

      this.fetched = true
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
    otherActor (obj) {
      if (!obj.ot_code) return
      const res = find(this.smallCodes(), (o) => o.s_code === obj.ot_code)
      return res ? res.s_name.slice(0, 8) : ''
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0], {raw: true})
      XLSX.writeFile(wb, '봉사활동현황.xlsx')
    }
  }
}
</script>

<style scoped>
  .stats-acts-table tr td {
   width: 80px !important;
  }
  .w-5 {
    width: 5% !important;;
  }
</style>
