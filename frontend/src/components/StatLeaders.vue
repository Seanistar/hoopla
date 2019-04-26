<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex xs2>
        <v-select label="연도선택" class="w-90 text-xs-center body-1" clearable
                  :items="years" v-model="s_year"></v-select>
      </v-flex>
      <v-flex xs10 text-xs-right>
        <v-btn color="primary" outline @click="toExcel">내려받기</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table id="leaders" :items="statLeaders" :headers="headers"
                  hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{props.index + 1}}</td>
          <td class="text-xs-center">{{props.item.name}}</td>
          <td class="text-xs-center">{{props.item.ca_name}}</td>
          <td class="text-xs-center">{{props.item.s_name}}</td>
          <td class="text-xs-center">{{props.item.phone|phoneNumber}}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="6">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_LEADERS } from '@/store/actions.type'
import { range } from 'lodash/util'
import XLSX from 'xlsx'

export default {
  name: 'StatLeaders',
  computed: {
    ...mapGetters(['statLeaders']),
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 1994, -1))
    },
    headers () {
      return [
        { text: '번호', value: 'id', sortable: false, align: 'center' },
        // { text: '고유번호', value: 'ca_id' },
        { text: '성명', value: 'name', align: 'center' },
        { text: '세례명', value: 'ca_name', align: 'center' },
        { text: '소속 본당', value: 'a_code', align: 'center' },
        { text: '전화 번호', value: 'phone', sortable: false, align: 'center' }
      ]
    }
  },
  data: () => ({
    items: [],
    s_year: null
  }),
  watch: {
    s_year (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const params = { s_year: this.s_year }
      await this.$store.dispatch(FETCH_STAT_LEADERS, {params})
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0])
      XLSX.writeFile(wb, 'stats_leaders.xlsx')
    }
  },
  filters: {
    phoneNumber (x) {
      if (x.length !== 11) return x
      return x.toString().replace(/(^01.{1})([0-9]{4})([0-9]{4})/, '$1-$2-$3')
      /* UPDATE volunteers SET phone = REGEXP_REPLACE(phone, '(^01.{1})([0-9]{4})([0-9]{4})', '$1-$2-$3') WHERE LENGTH(phone)=11; */
    }
  }
}
</script>

<style scoped>
  table, th, td {
    /*border: 1px solid grey;*/
    border-collapse: collapse;
  }
</style>
