<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex xs3>
        <v-select label="교구선택" class="body-2" clearable
                    v-model="area" :items="areaList" item-value="code" item-text="name">
        </v-select>
      </v-flex>
      <v-flex xs3 ml-3 pl-2>
        <v-combobox label="본당선택" class="text-xs-center body-1" clearable
                  :items="churchList" item-value="code" item-text="name"
                  v-model="church"></v-combobox>
      </v-flex>
      <v-flex xs3 ml-3>
        <v-radio-group v-model="type" row height="30">
          <v-radio label="교육 현황" value="edus"></v-radio>
          <v-radio label="봉사 현황" value="acts"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
    <v-data-table :items="items" :pagination.sync="pagination" class="elevation-1">
      <template slot="headers" slot-scope="props">
        <template v-if="type === 'edus'">
          <tr>
            <th rowspan="3" class="body-2 font-weight-bold w-10">연도 구분</th>
            <th :colspan="ebsCodes.length" class="body-2 font-weight-bold">교육 현황 (명)</th>
            <th :colspan="grpCodes.length" class="body-2 font-weight-bold">그룹 공부 현황 (명)</th>
            <th :colspan="trnCodes.length" class="body-2 font-weight-bold">성서 연수 현황 (명)</th>
            <th :colspan="stdCodes.length" class="body-2 font-weight-bold">노트 검사 현황 (명)</th>
          </tr>
          <tr>
            <th rowspan="2" class="align-center caption" v-for="header in ebsCodes" :key="header.code"><p class="head-title">{{header.name}}</p></th>
            <th rowspan="2" class="align-center caption" v-for="header in grpCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
            <th rowspan="2" class="align-center caption" v-for="header in trnCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
            <th rowspan="2" class="align-center caption" v-for="header in stdCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th rowspan="3" class="body-2 font-weight-bold w-10">연도 구분</th>
            <th :colspan="actCodes.length * 2" class="body-2 font-weight-bold">봉사 현황</th>
          </tr>
          <tr>
            <th colspan="2" class="align-center caption" v-for="header in actCodes" :key="header.code">{{header.name}}</th>
          </tr>
          <tr>
            <template v-for="n in actCodes.length">
              <th class="align-center caption" :key="n">그룹</th>
              <th class="align-center caption" :key="actCodes.length + n">인원</th>
            </template>
          </tr>
        </template>
      </template>
      <template slot="items" slot-scope="props">
        <tr v-if="type === 'edus'">
          <td class="text-xs-center w-10">{{props.item|yearKey}}</td>
          <td class="text-xs-center" v-for="at in ebsCodes" :key="at.code">{{props.item|yearBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in grpCodes" :key="at.code">{{props.item|yearBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in trnCodes" :key="at.code">{{props.item|yearBy|uv_counter(at)|units}}</td>
          <td class="text-xs-center" v-for="at in stdCodes" :key="at.code">{{props.item|yearBy|uv_counter(at)|units}}</td>
        </tr>
        <tr v-else>
          <td class="text-xs-center w-10">{{props.item|yearKey}}</td>
          <template v-for="(at, i) in actCodes">
            <td class="text-xs-center" :key="ebsCodes.length + i">{{props.item|yearBy|gp_counter(at)}}</td>
            <td class="text-xs-center" :key="(ebsCodes.length + 100) + i">{{props.item|yearBy|uv_counter(at)|units}}</td>
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
import { FETCH_STAT_YEARLY } from '@/store/actions.type'
import { groupBy, orderBy, map } from 'lodash/collection'
import { sumBy } from 'lodash/math'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatYearly',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'grpCodes',
      'ebsCodes',
      'trnCodes',
      'stdCodes',
      'areaCodes',
      'largeCodes',
      'smallCodes',
      'statYears'
    ])
  },
  data: () => ({
    items: [],
    areaList: [],
    churchList: [],
    area: null,
    church: null,
    type: 'edus',
    pagination: {rowsPerPage: 25}
  }),
  watch: {
    church (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    },
    area (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    },
    type () {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => this.setArea())
  },
  methods: {
    async fetchData () {
      const params = { church: this.church && this.church.code, area: this.area, type: this.type }
      await this.$store.dispatch(FETCH_STAT_YEARLY, {params})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statYears
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'e_year')
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        let obj = {}; obj[k] = yg[k]
        this.items.push(obj)
      })
      this.items.reverse()

      const ye = groupBy(qv, 'e_code')
      let rs = {}
      Object.keys(ye).forEach(f => {
        rs[f] = [{uv_count: sumBy(ye[f], 'uv_count'), gp_count: sumBy(ye[f], 'gp_count')}]
      })
      this.items = [{'합계': rs}].concat(this.items)
    },
    setArea () {
      this.$nextTick(() => {
        this.areaList = map(this.largeCodes, o => { return {code: o.l_code, name: o.l_name} })
      })
      const list = map(this.smallCodes(), o => {
        const full = `${o.s_name} (${o.l_name}-${o.m_name})`
        return {code: o.s_code, name: full}
      })
      this.churchList = orderBy(list, ['name'])
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
  table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
  }
  th, td {
    max-width: 25px !important;
    min-width: 20px !important;
    padding: 3px !important;
    text-align: center;
  }
  tbody tr:first-child {
    background-color: orange;
  }
  .head-title {
    white-space: normal;
    margin-bottom: 0 !important;
  }
</style>
