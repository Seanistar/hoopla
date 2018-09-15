<template>
  <v-container pt-2>
    <inline-text-box/>
    <v-data-table hide-actions class="elevation-1" :items="items"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" style="width: 10%" class="body-2 font-weight-bold">연도</th>
          <th colspan="6" style="width: 90%" class="body-2 font-weight-bold">교육 참석 현황</th>
          <!--<th colspan="9" style="width: 60%" class="subheading font-weight-bold">성서 연수 현황</th>-->
        </tr>
        <tr>
          <th class="body-1" style="width: 15%">월교육</th>
          <th class="body-1" style="width: 15%">성서40주간<br>읽기안내</th>
          <th class="body-1" style="width: 15%">성서40주간<br>심화</th>
          <th class="body-1" style="width: 15%">재교육</th>
          <th class="body-1" style="width: 15%">피정</th>
          <th class="body-1" style="width: 15%">기타교육</th>
          <!--<th class="body-1 font-weight-bold" v-for="item in headers" :key="item.code">{{item.name|subject}}</th>-->
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
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

export default {
  name: 'QueryEdus',
  components: { InlineTextBox },
  computed: {
    headers () {
      return this.$store.getters.trnCodes
    }
  },
  data: () => ({
    items: [],
    selected: {}
  }),
  filters: {
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
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
