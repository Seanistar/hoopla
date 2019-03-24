<template>
  <v-container class="elevation-3 pt-2 mb-4">
    <v-layout row wrap pb-0 align-baseline>
      <v-flex xs6>
        <v-layout row align-baseline>
          <!--<v-flex xs2>
            <v-subheader class="body-2 pr-0">소속본당 : </v-subheader>
          </v-flex>-->
          <v-flex xs5>
            <v-combobox label="소속본당" class="body-2" @input="fetchReports()"
                        v-model="model" :items="items" item-value="code" item-text="name"
                        :search-input.sync="search" clearable single-line> <!--:disabled="authInfo.level === 'L3'"-->
              <template slot="no-data">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      "<strong>{{ search }}</strong>" 본당이 없습니다. 관리자에게 문의해주세요.
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-combobox>
          </v-flex>
          <v-flex xs3 ml-3 pl-2>
            <v-select label="연도선택" class="w-90 text-xs-center body-1" single-line
                      :items="years" v-model="rYear"></v-select>
          </v-flex>
          <!--<v-flex xs3>
            <v-select label="기간선택" class="ml-3 pl-4 w-90 text-xs-center body-1" single-line
                    :items="[{nm: '상반기', vl: 'A'}, {nm: '하반기', vl: 'B'}]"
                    item-text="nm" item-value="vl" v-model="rHalf"></v-select>
          </v-flex>-->
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <!--<v-btn color="deep-orange accent-2" outline dark class="mb-2" @click="deleteReport">보고 삭제</v-btn>-->
          <v-btn color="indigo accent-2" outline dark class="mb-2" @click="newReport">신규 보고</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-data-table :headers="headers" :items="reports"
                  :pagination.sync="pagination" :rows-per-page-items="perPage"
                  class="elevation-5" :loading="fetched && isReportsLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" @dblclick="editReport(props.item.id, props.item.s_code)"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.r_year }}</td>
          <!--<td class="text-xs-center">{{ props.item.r_half === 'A' ? '상반기' : '하반기' }}</td>-->
          <td class="text-xs-center">{{ props.item.area_name }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <!--<td class="text-xs-center">{{ props.item.phone|formatted }}</td>-->
          <td class="text-xs-center">{{ props.item.created|datestamp }}</td>
          <td class="text-xs-center">{{ props.item.numbers }}</td>
          <td class="text-xs-center">{{ props.item.s_date|monthstamp }} ~ {{ props.item.e_date|monthstamp }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-3" @click.self="editReport(props.item.id, props.item.s_code)">edit</v-icon>
            <v-icon small @click.self="deleteReport(props.item.id)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">현황 내역이 없습니다.</div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { map, find, orderBy } from 'lodash/collection'
import { range } from 'lodash/util'
import { FETCH_REPORTS, DELETE_REPORT, FETCH_SMALL_LEADER } from '@/store/actions.type'
import { SET_CHANGED_CODE } from '@/store/mutations.type'

export default {
  name: 'ReportList',
  computed: {
    ...mapGetters([
      'smallCodes',
      'authInfo',
      'areaCodes',
      'reportCode',
      'isReportsLoading',
      'changedChurchCode',
      'reports',
      'reportCount'
    ]),
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 2010, -1))
    }
  },
  watch: {
    model (obj) {
      obj && console.log(obj.code, obj.name)
    },
    rYear (val) {
      if (val && typeof val === 'string') {
        this.rYear = ''
        return
      }
      this.fetchReports()
    }
  },
  data: () => ({
    items: [],
    model: null,
    search: null,
    fetched: false,
    selected: {},
    rYear: '',
    rHalf: '',
    perPage: [50, 100, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
    pagination: {descending: true},
    headers: [
      { text: '보고연도', value: 'r_code' },
      // { text: '기간구분', value: 'r_half' },
      { text: '소속', value: 'area_name' },
      { text: '작성자', value: 'name' },
      { text: '작성일', value: 'created' },
      { text: '봉사자수', value: 'number' },
      { text: '보고기간', value: 'e_date' },
      { text: '편집', value: 'edit', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-1'] })
  },
  methods: {
    async fetchReports (code) {
      let reqCode = code !== undefined ? code : (this.model ? this.model.code : '')
      const params = {}
      if (reqCode) params['code'] = reqCode
      if (this.rYear) params['year'] = this.rYear
      await this.$store.dispatch(FETCH_REPORTS, params)
      this.fetched = true

      // reqCode && this.$store.dispatch(FETCH_SMALL_LEADER, reqCode)
      reqCode && this.$store.commit(SET_CHANGED_CODE, reqCode)
    },
    async newReport () {
      if (!this.model || !this.model.code || !this.rYear) return alert('보고서 조건을 선택하세요!')
      await this.$store.dispatch(FETCH_SMALL_LEADER, this.model.code)
      const rObj = {sCode: this.model.code, sName: this.model.name, rYear: this.rYear, rHalf: this.rHalf}
      this.$router.push({name: 'edit-report', params: {rObj}})
    },
    async editReport (id, sCode) {
      if (!sCode) return alert('본당을 선택하세요!')
      await this.$store.dispatch(FETCH_SMALL_LEADER, sCode)
      this.$router.push({name: 'edit-report', params: {id}})
    },
    deleteReport (id) {
      if (!id) return alert('삭제할 내역을 선택해주세요!')
      if (!confirm('이 항목을 삭제하시겠습니까?')) return
      this.$store.dispatch(DELETE_REPORT, id) && this.$showSnackBar('삭제되었습니다!')
    },
    setLastChangedCode () {
      let code = this.changedChurchCode
      if (!code) code = this.authInfo.area_code

      setTimeout(() => {
        this.setCodeInfo(code)
        this.fetchReports(code)
      }, 600)
    },
    async setCodeInfo (code) {
      if (!this.areaCodes.length) await this.$store.dispatch('fetchAreaCodes')
      const list = map(this.smallCodes(this.authInfo), o => {
        const path = `${o.s_name} (${o.l_name}-${o.m_name})`
        return {code: o.s_code, name: path}
      })
      this.items = orderBy(list, ['name'])

      const res = find(list, o => o.code === code)
      res && this.$nextTick(() => {
        this.model = {name: res.name, code: res.code}
      })
    }
  },
  filters: {
    formatted (no) {
      if (!no) return ''
      if (no && no.toString().indexOf('-') > 0) return no
      const pn1 = no.toString().slice(0, 3)
      const pn2 = no.toString().slice(3, 7)
      const pn3 = no.toString().slice(7)
      return `${pn1}-${pn2}-${pn3}`
    }
  }
}
</script>

<style scoped>
  .w-100px {
    width: 100px;
  }
</style>
