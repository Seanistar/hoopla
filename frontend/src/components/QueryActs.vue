<template>
  <v-container pt-2>
    <inline-text-box/>
    <v-data-table :headers="headers" :items="items" hide-actions
                  class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" class="body-2 font-weight-bold w-10">연도</th>
          <th colspan="9" class="body-2 font-weight-bold w-90">그룹 봉사 현황</th>
        </tr>
        <tr>
          <th class="align-center body-1 w-10"
              v-for="header in props.headers" :key="header.code"
          >{{ header.name }}
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="10">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import InlineTextBox from './control/InlineTextBox'

export default {
  name: 'QueryActs',
  components: { InlineTextBox },
  computed: {
    headers () {
      return this.$store.getters.actCodes
    }
  },
  data: () => ({
    items: []
  })
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
