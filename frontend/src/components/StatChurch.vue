<template>
  <v-container pt-2 mt-3>
    <!--<inline-text-box :au_year="queryInfo.good.au_date|yearstamp"
                     :v_name="`${queryInfo.good.name} ${queryInfo.good.ca_name}`"/>-->
    <v-data-table :items="items" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" class="body-2 font-weight-bold w-10">본당</th>
          <th :colspan="actCodes.length" class="body-2 font-weight-bold w-90">그룹 봉사 현황</th>
        </tr>
        <tr>
          <th class="align-center body-1 w-10"
              v-for="header in actCodes" :key="header.code">{{ header.name }}
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{ props.item|yearKey }}</td>
          <td class="text-xs-center" v-for="(at, i) in actCodes" :key="i">{{ props.item|yearBy|counter(at) }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="10">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_CHURCH } from '@/store/actions.type'
import { groupBy, find } from 'lodash/collection'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatChurch',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'areaCodes',
      'statChurch'
    ])
  },
  data: () => ({
    items: []
  }),
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      await this.$store.dispatch(FETCH_STAT_CHURCH)
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statChurch
      if (!qv) return

      const yg = groupBy(qv, 'a_code')
      const _this = this
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        const area = find(_this.areaCodes, (o) => o.a_code === k)
        if (area) {
          let obj = {}; obj[area.s_name] = yg[k]
          this.items.push(obj)
        }
      })
      // this.items.reverse()
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
    padding: 5px;
    text-align: center;
  }
</style>
