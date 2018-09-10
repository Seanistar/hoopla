<template>
  <v-container pa-0 mt-4>
    <v-layout row wrap pb-2>
      <v-flex xs4>
        <v-subheader class="subheading"><span class="mr-3">선서연도 :</span>
          <v-flex xs3><v-text-field label="2014" value="" single-line suffix="년"></v-text-field></v-flex>
        </v-subheader>
      </v-flex>
    </v-layout>
    <v-data-table hide-actions class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" style="width: 10%" class="subheading font-weight-bold">연도</th>
          <th colspan="5" style="width: 30%" class="subheading font-weight-bold">교육 참석 현황</th>
          <th colspan="9" style="width: 60%" class="subheading font-weight-bold">노트 검사 현황</th>
        </tr>
        <tr>
          <th class="body-1 font-weight-bold">월교육</th>
          <th class="body-1 font-weight-bold">특강</th>
          <th class="body-1 font-weight-bold">재교육</th>
          <th class="body-1 font-weight-bold">피정</th>
          <th class="body-1 font-weight-bold">기타교육</th>
          <th class="body-1 font-weight-bold" v-for="item in headers" :key="item.code">{{item.name}}</th>
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
        <tr class="text-xs-center"><td colspan="15">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'QueryEdus',
  computed: {
    headers () {
      return this.$store.getters.trnCodes
    }
  },
  data: () => ({
    items: []
  })
}
</script>

<style scoped>
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  th, td {
    padding: 5px;
    text-align: center;
  }
</style>
