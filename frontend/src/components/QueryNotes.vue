<template>
  <v-container pt-2>
    <!--<inline-text-box :au_year="queryInfo.good.au_date|yearstamp"
                     :v_name="`${queryInfo.good.name} ${queryInfo.good.ca_name} (${queryInfo.good.sa_name} 본당)`"/>-->
    <slot name="voltInfo"></slot>
    <v-data-table hide-actions class="elevation-1" :items="items"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" class="body-1 font-weight-bold w-10">연도</th>
          <th :colspan="stdCodes.length" class="body-1 font-weight-bold w-90">노트 검사 현황</th>
        </tr>
        <tr>
          <th class="body-1 w-10"
              v-for="item in stdCodes" :key="item.code">{{item.name|subject}}</th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{ props.item|yearKey }}</td>
          <td class="text-xs-center" v-for="(nt, i) in stdCodes" :key="i">{{ props.item|keyBy|counter(nt) }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="16">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <slot name="moveTo"></slot>
  </v-container>
</template>

<script>
// import InlineTextBox from './control/InlineTextBox'
import QueryMixin from '../common/query.mixin'

export default {
  name: 'QueryNotes',
  mixins: [ QueryMixin ],
  // components: { InlineTextBox },
  created () { this.e_type = 'N' }
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
