<template>
  <v-container pt-2 mt-3>
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
    </v-layout>
    <v-data-table :items="items" :pagination.sync="pagination" class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="3" class="body-2 font-weight-bold w-10">연도</th>
          <th :colspan="essCodes.length" class="body-2 font-weight-bold">교육 현황</th>
          <th :colspan="actCodes.length * 2" class="body-2 font-weight-bold">봉사 현황</th>
          <th :colspan="grpCodes.length" class="body-2 font-weight-bold">그룹 공부 현황</th>
        </tr>
        <tr>
          <th rowspan="2" class="align-center caption" v-for="header in essCodes" :key="header.code"><p class="head-title">{{header.name|front}}</p></th>
          <th colspan="2" class="align-center caption" v-for="header in actCodes" :key="header.code">{{header.name}}</th>
          <th rowspan="2" class="align-center caption" v-for="header in grpCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
        </tr>
        <tr>
          <template v-for="n in actCodes.length">
            <th class="align-center caption" :key="n">그룹</th>
            <th class="align-center caption" :key="actCodes.length + n">인원</th>
          </template>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{props.item|yearKey}}</td>
          <td class="text-xs-center" v-for="(at, i) in essCodes" :key="i">{{props.item|yearBy|uv_counter(at)|units}}</td>
          <template v-for="(at, i) in actCodes">
            <td class="text-xs-center" :key="essCodes.length + i">{{props.item|yearBy|gp_counter(at)}}</td>
            <td class="text-xs-center" :key="(essCodes.length + 100) + i">{{props.item|yearBy|uv_counter(at)|units}}</td>
          </template>
          <td class="text-xs-center" v-for="(at, i) in grpCodes" :key="(essCodes.length + actCodes.length) + i">{{props.item|yearBy|uv_counter(at)|units}}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="31">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// import InlineTextBox from './control/InlineTextBox'
// import QueryMixin from '../common/query.mixin'
import { mapGetters } from 'vuex'
import { FETCH_STAT_YEARLY } from '@/store/actions.type'
import { groupBy, orderBy, map } from 'lodash/collection'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatYearly',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'grpCodes',
      'essCodes',
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
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => this.setArea())
  },
  methods: {
    async fetchData () {
      const params = { church: this.church && this.church.code, area: this.area }
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
  .head-title {
    white-space: normal;
    margin-bottom: 0 !important;
  }
</style>
