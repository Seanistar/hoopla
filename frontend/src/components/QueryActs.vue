<template>
  <v-container pa-0 mt-4>
    <v-layout row wrap pb-2>
      <v-flex xs2>
        <v-subheader class="body-2"><span class="mr-3">선서연도 :</span>
          <v-flex xs5><v-text-field label="2014" value="" single-line suffix="년"></v-text-field></v-flex>
        </v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-subheader class="body-2"><span class="mr-3">봉사자 :</span>
          <v-flex xs8><v-text-field label="김성휘 사도요한" value="" single-line></v-text-field></v-flex>
        </v-subheader>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="items" hide-actions
                  class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" style="width: 10%" class="subheading font-weight-bold">연도</th>
          <th colspan="9" style="width: 90%" class="subheading font-weight-bold">그룹 봉사 현황</th>
        </tr>
        <tr>
          <th class="align-center body-1 font-weight-bold" style="width: 10%"
              v-for="header in props.headers" :key="header.code"
          >{{ header.name }}
          </th>
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
        <div class="text-xs-center">현황 내역이 없습니다.</div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>

export default {
  name: 'QueryActs',
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
