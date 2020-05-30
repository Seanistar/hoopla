<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex :class="$parent.window.width >= 900 ? 'xs2' : ['xs6', 'ml-2']">
        <v-select label="연도선택" class="w-90 text-xs-center body-1" clearable
                  :items="years" v-model="s_year"></v-select>
      </v-flex>
      <v-flex ml-2 :class="$parent.window.width >= 900 ? 'xs3' : ['xs6', 'mr-2']">
        <v-select label="교구선택" class="body-2" clearable
                  :items="areaList" v-model="l_area" item-value="code" item-text="name">
        </v-select>
      </v-flex>
      <v-flex text-xs-right v-if="$parent.window.width >= 900">
        <v-btn color="primary" outline @click="toExcel">내려받기</v-btn>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="!fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table id="leaders" :items="statLeaders" :headers="headers"
                  hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center" style="width: 50px">{{props.index + 1}}</td>
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
import { map } from 'lodash/collection'
import XLSX from 'xlsx'

export default {
  name: 'StatLeaders',
  computed: {
    ...mapGetters(['statLeaders', 'largeCodes']),
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 1994, -1))
    },
    headers () {
      return [
        { text: '번호', value: 'id', sortable: false, align: 'center' },
        // { text: '고유번호', value: 'ca_id' },
        { text: '성명', value: 'name', align: 'center', class: ['body-1', 'font-weight-bold'] },
        { text: '세례명', value: 'ca_name', align: 'center', class: ['body-1', 'font-weight-bold'] },
        { text: '소속 본당', value: 'a_code', align: 'center', class: ['body-1', 'font-weight-bold'] },
        { text: '전화 번호', value: 'phone', sortable: false, align: 'center', class: ['body-1', 'font-weight-bold'] }
      ]
    }
  },
  data: () => ({
    items: [],
    areaList: [],
    fetched: false,
    s_year: null,
    l_area: null
  }),
  watch: {
    s_year (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    },
    l_area (nv, ov) {
      if (!ov && !nv) return
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => { this.setArea() })
  },
  methods: {
    async fetchData () {
      const params = { s_year: this.s_year, l_area: this.l_area }
      await this.$store.dispatch(FETCH_STAT_LEADERS, {params})
      this.fetched = true
    },
    setArea () {
      this.$nextTick(() => {
        this.areaList = map(this.largeCodes, o => { return {code: o.l_code, name: o.l_name} })
      })
      this.areaList = [{code: '', name: '선택없음'}].concat(this.areaList)
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0], {raw: true})
      XLSX.writeFile(wb, '대표봉사자현황.xlsx')
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
  head-font {
    font-size: 16px;
  }
</style>
