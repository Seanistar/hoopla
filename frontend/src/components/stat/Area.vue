<template>
  <v-container pt-2 mt-1>
    <v-layout justify-center v-if="$parent.window.width >= 900">
      <v-flex xs2 mt-2>
        <v-radio-group v-model="type" row height="20" hide-details>
          <v-radio label="교육 현황" value="edus"></v-radio>
          <v-radio label="봉사 현황" value="acts"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs2>
        <v-select label="연도선택" class="w-90 text-xs-center body-1" clearable
                  :items="years" v-model="year"></v-select>
      </v-flex>
      <!--<v-flex xs2 mt-3>
        <div class="body-2 grey&#45;&#45;text">※ 현재 연도 자료입니다.</div>
      </v-flex>-->
      <v-flex xs8 mt-2 text-xs-right>
        <v-btn color="primary" outline @click="toExcel">내려받기</v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12>
        <v-radio-group v-model="type" row height="20" class="ml-3">
          <v-radio label="교육 현황" value="edus"></v-radio>
          <v-radio label="봉사 현황" value="acts"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="!fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :items="items" hide-actions
                  style="max-height: calc(80vh - 10px);backface-visibility: hidden;"
                  :class="type === 'edus' ? 'main-table' : 'acts-table'"
                  class="elevation-1  fixed-header v-table__overflow">
      <template slot="headers" slot-scope="props">
        <template v-if="type === 'edus'">
          <tr class="first-row">
            <th rowspan="2" class="body-2 font-weight-bold w-5"><p class="head-title">교구 구분</p></th>
            <th :colspan="ebsCodes.length" class="body-2 font-weight-bold">교육 현황 (명)</th>
            <th :colspan="grpCodes.length" class="body-2 font-weight-bold">그룹 공부 현황 (명)</th>
            <th :colspan="trnCodes.length" class="body-2 font-weight-bold">성서 연수 현황 (명)</th>
            <th :colspan="stdCodes.length" class="body-2 font-weight-bold">노트 검사 현황 (명)</th>
          </tr>
          <tr class="data-column second-row">
            <th class="align-center caption" v-for="header in ebsCodes" :key="header.code"><p class="head-title">{{header.name}}</p></th>
            <th class="align-center caption" v-for="header in grpCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
            <th class="align-center caption" v-for="header in trnCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
            <th class="align-center caption" v-for="header in stdCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
          </tr>
        </template>
        <template v-else>
          <tr class="first-row">
            <th rowspan="3" class="body-2 font-weight-bold w-5"><p class="head-title">교구 구분</p></th>
            <th :colspan="actCodes.length * 2" class="body-2 font-weight-bold">봉사 현황</th>
          </tr>
          <tr class="data-column second-row">
            <th colspan="2" class="align-center caption" v-for="header in actCodes" :key="header.code">{{header.name}}</th>
          </tr>
          <tr class="data-column third-row">
            <template v-for="n in actCodes.length">
              <th class="align-center caption" :key="n">그룹</th>
              <th class="align-center caption" :key="actCodes.length + n">인원</th>
            </template>
          </tr>
        </template>
      </template>
      <template slot="items" slot-scope="props">
        <tr class="first-column" v-if="type === 'edus'">
          <td class="text-xs-center ">{{props.item|yearKey}}</td>
          <td class="text-xs-center" v-for="at in ebsCodes" :key="at.code">{{props.item|keyBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in grpCodes" :key="at.code">{{props.item|keyBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in trnCodes" :key="at.code">{{props.item|keyBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in stdCodes" :key="at.code">{{props.item|keyBy|uv_counter(at)|units}}</td>
        </tr>
        <tr class="first-column" v-else>
          <td class="text-xs-center w-10">{{props.item|yearKey}}</td>
          <template v-for="(at, i) in actCodes">
            <td class="text-xs-center" :key="ebsCodes.length + i">{{props.item|keyBy|gp_counter(at)|units}}</td>
            <td class="text-xs-center" :key="(ebsCodes.length + 100) + i">{{props.item|keyBy|uv_counter(at)|units}}</td>
          </template>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="34">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_AREA } from '@/store/actions.type'
import { groupBy, find } from 'lodash/collection'
import { range } from 'lodash/util'
import { sumBy } from 'lodash/math'
import FiltersMixin from '../../common/filters.mixin'
import XLSX from 'xlsx'

export default {
  name: 'StatChurch',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'grpCodes',
      'ebsCodes',
      'trnCodes',
      'stdCodes',
      'areaCodes',
      'statArea'
    ]),
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 1975, -1))
    }
  },
  data: () => ({
    items: [],
    fetched: false,
    type: 'edus',
    year: null
  }),
  watch: {
    'areaCodes' (val) {
      val.length && this._mapData()
    },
    type () {
      this.fetchData()
    },
    year (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.fetched = false
      const params = { type: this.type, year: this.year }
      await this.$store.dispatch(FETCH_STAT_AREA, {params})
      this.$nextTick(() => { this._mapData() })
    },
    async _mapData () {
      const qv = this.statArea
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'l_code')
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        const area = find(this.areaCodes, (o) => o.a_code === k)
        if (area) {
          let obj = {}; obj[`${area.l_name}`] = yg[k]
          this.items.push(obj)
        }
      })

      const ye = groupBy(qv, 'e_code')
      let rs = {}
      Object.keys(ye).forEach(f => {
        rs[f] = [{uv_count: sumBy(ye[f], 'uv_count'), gp_count: sumBy(ye[f], 'gp_count')}]
      })
      this.items = [{'합계': rs}].concat(this.items)
      this.fetched = true
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0], {raw: true})
      XLSX.writeFile(wb, '교구별현황.xlsx')
    }
  },
  filters: {
    units (x) {
      if (!Number.isInteger(x) || Number.isNaN(x)) return x
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped>
  tbody tr:first-child {
    background-color: orange;
  }
</style>
