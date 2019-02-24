<template>
  <v-container pt-2 mt-3>
    <!--<inline-text-box :au_year="queryInfo.good.au_date|yearstamp"
                     :v_name="`${queryInfo.good.name} ${queryInfo.good.ca_name}`"/>-->
    <v-data-table :items="items" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="3" class="body-2 font-weight-bold w-10">본당 구분</th>
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
          <td class="text-xs-center w-10">{{props.item|yearKey}}</td>
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
import { mapGetters } from 'vuex'
import { FETCH_STAT_AREA } from '@/store/actions.type'
import { groupBy, find } from 'lodash/collection'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatChurch',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'grpCodes',
      'essCodes',
      'areaCodes',
      'statArea'
    ])
  },
  data: () => ({
    items: []
  }),
  watch: {
    'areaCodes' (val) {
      val.length && this._mapData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch(FETCH_STAT_AREA)
      this.$nextTick(() => { this._mapData() })
    },
    async _mapData () {
      const qv = this.statArea
      if (!qv) return

      const yg = groupBy(qv, 'l_code')
      const _this = this
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        const area = find(_this.areaCodes, (o) => o.a_code === k)
        if (area) {
          let obj = {}; obj[`${area.l_name}`] = yg[k]
          this.items.push(obj)
        }
      })
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
