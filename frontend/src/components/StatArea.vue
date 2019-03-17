<template>
  <v-container pt-2 mt-3>
    <v-flex xs3>
      <v-radio-group v-model="type" row height="20" hide-details>
        <v-radio label="교육 현황" value="edus"></v-radio>
        <v-radio label="봉사 현황" value="acts"></v-radio>
      </v-radio-group>
    </v-flex>
    <v-data-table :items="items" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <template v-if="type === 'edus'">
          <tr>
            <th rowspan="3" class="body-2 font-weight-bold w-10">교구 구분</th>
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
            <th rowspan="3" class="body-2 font-weight-bold w-10">교구 구분</th>
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
import { FETCH_STAT_AREA } from '@/store/actions.type'
import { groupBy, find } from 'lodash/collection'
import { sumBy } from 'lodash/math'
import FiltersMixin from '../common/filters.mixin'

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
    ])
  },
  data: () => ({
    items: [],
    type: 'edus'
  }),
  watch: {
    'areaCodes' (val) {
      val.length && this._mapData()
    },
    type () {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const params = { type: this.type }
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
