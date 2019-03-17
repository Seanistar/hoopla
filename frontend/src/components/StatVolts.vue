<template>
  <v-container pt-2 mt-3>
    <v-layout row align-baseline>
      <v-flex xs3>
        <v-select label="교구선택" class="body-2" clearable
                  v-model="area" :items="areaList" item-value="code" item-text="name">
        </v-select>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="isVolunteersLoading && !fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :items="items" :pagination.sync="pagination" class="elevation-1"
      v-if="churchList.length">
      <template slot="headers" slot-scope="props">
        <tr>
          <th class="body-2 font-weight-bold w-10">연도</th>
          <th class="align-center body-1 w-5" v-for="(church, idx) in churchList" :key="idx"><p class="head-title">{{church.name}}</p></th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{Object.keys(props.item)[0]}}</td>
          <td v-for="(at, idx) in churchList" class="text-xs-center" :key="idx">{{props.item|yearBy|counter(at)|units}}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="31">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_VOLT } from '@/store/actions.type'
import { groupBy, orderBy, map } from 'lodash/collection'
import { sumBy } from 'lodash/math'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatVolts',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'grpCodes',
      'essCodes',
      'largeCodes',
      'smallCodes',
      'statVolts',
      'isVolunteersLoading'
    ])
  },
  data: () => ({
    items: [],
    areaList: [],
    churchList: [],
    area: null,
    church: null,
    fetched: false,
    pagination: {rowsPerPage: 25}
  }),
  watch: {
    church (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    },
    area (nv, ov) {
      if (!ov && !nv) return
      this.setArea()
      this.fetchData()
    },
    'areaCodes' (val) {
      val.length && this.setArea()
    }
  },
  created () {
    this.fetchData()
    setTimeout(() => this.setArea(), 500)
  },
  methods: {
    async fetchData () {
      const params = { area: this.area }
      await this.$store.dispatch(FETCH_STAT_VOLT, {params})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statVolts
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'au_year')
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'a_code')
        let obj = {}; obj[k] = yg[k]
        this.items.push(obj)
      })
      this.items.reverse()

      const ye = groupBy(qv, 'a_code')
      let rs = {}
      Object.keys(ye).forEach(f => {
        rs[f] = [{counter: sumBy(ye[f], 'counter')}]
      })
      this.items = [{'합계': rs}].concat(this.items)
      this.fetched = true
    },
    setArea () {
      this.areaList = map(this.largeCodes, o => { return {code: o.l_code, name: o.l_name} })

      if (this.area) {
        let list = map(this.smallCodes(), o => {
          return { code: o.s_code, name: o.s_name, area: o.l_code }
        })
        if (this.area) list = list.filter((a) => a.area === this.area)
        this.churchList = orderBy(list, ['name'])
      } else {
        this.churchList = this.areaList
      }
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
  th {
    max-width: 30px !important;
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
  .w-5 {
    width: 5% !important;
  }
</style>
