<template>
  <v-container pt-2>
    <inline-text-box :au_year="queryInfo.good.au_date|yearstamp"
                     :v_name="`${queryInfo.good.name} ${queryInfo.good.ca_name}`"/>
    <v-data-table hide-actions class="elevation-1" :items="items">
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" class="body-2 font-weight-bold w-10">연도</th>
          <th colspan="7" class="body-2 font-weight-bold w-90">교육 참석 현황</th>
        </tr>
        <tr>
          <th class="body-1 w-15" v-for="(ec, i) in ebsCodes" :key="i" v-html="twoLine(ec.name)"></th>
          <th class="body-1">합계</th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr> <!--@click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">-->
          <td class="text-xs-center">{{ props.item|yearKey }}</td>
          <td class="text-xs-center" v-for="(ec, i) in ebsCodes" :key="i">{{ props.item|yearBy|counter(ec) }}</td>
          <td class="text-xs-center">{{ props.item|yearBy|sumRow }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="16">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import InlineTextBox from './control/InlineTextBox'
import QueryMixin from '../common/query.mixin'
import { reduce } from 'lodash/collection'

export default {
  name: 'QueryEdus',
  mixins: [ QueryMixin ],
  components: { InlineTextBox },
  methods: {
    twoLine (name) {
      return name.replace('-', '<br>')
    }
  },
  filters: {
    sumRow (row) {
      const keys = Object.keys(row)
      return reduce(keys, (t, n) => {
        n = row[n][0].counter
        return t + n
      }, 0)
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
