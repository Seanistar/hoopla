<template>
  <v-container class="elevation-3 w-85 pt-2">
    <v-layout row wrap pb-0 align-baseline>
      <v-flex xs6>
        <v-layout row align-baseline>
          <v-flex xs2>
            <v-subheader class="body-2 pr-0">소속본당 : </v-subheader>
          </v-flex>
          <v-flex xs5>
            <v-combobox class="body-2" @input="onChange"
                        v-model="model" :items="items" item-value="code" item-text="name"
                        :search-input.sync="search" clearable single-line>
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
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <!--<v-btn color="deep-orange accent-2" outline dark class="mb-2" @click="deleteReport">보고 삭제</v-btn>-->
          <v-btn color="indigo accent-2" outline dark class="mb-2" @click="newReport">신규 보고</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-data-table :headers="headers" :items="reports" hide-actions
                  class="elevation-5" :loading="fetched && isReportsLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" @dblclick="editReport(props.item.id)"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.r_year }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.phone|formatted }}</td>
          <td class="text-xs-center">{{ props.item.created|datestamp }}</td>
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.s_date|monthstamp }} ~ {{ props.item.e_date|monthstamp }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-3" @click.self="editReport(props.item.id)">edit</v-icon>
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
import { FETCH_REPORTS, DELETE_REPORT } from '@/store/actions.type'

export default {
  name: 'ReportList',
  computed: {
    ...mapGetters([
      'smallCodes',
      'adminInfo',
      'reportCode',
      'isReportsLoading',
      'reports',
      'reportCount'
    ])
  },
  watch: {
    model (val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
    },
    'selected.id' (val) {
      // val && this.$router.push({name: 'edit-report', params: {id: val}})
    }
  },
  data: () => ({
    items: [],
    model: '',
    search: null,
    fetched: false,
    selected: {},
    headers: [
      { text: '보고연도', value: 'year' },
      { text: '작성자', value: 'name' },
      { text: '연락처', value: 'phone' },
      { text: '작성일', value: 'date' },
      { text: '봉사자수', value: 'volts' },
      { text: '보고기간', value: 'state' },
      { text: '편집', value: 'edit', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-1'] })
    const list = map(this.smallCodes, o => {
      return {code: o.s_code, name: o.s_name}
    })
    this.items = orderBy(list, ['name'])

    const res = find(list, o => o.code === this.adminInfo.area_code)
    if (res) this.model = res.name

    this.fetchReports(this.adminInfo.area_code)
  },
  methods: {
    async fetchReports (code) {
      await this.$store.dispatch(FETCH_REPORTS, code)
      this.fetched = true
    },
    newReport () {
      this.$router.push({name: 'edit-report'})
    },
    editReport (id) {
      this.$router.push({name: 'edit-report', params: {id}})
    },
    deleteReport (id) {
      if (!id) return alert('삭제할 내역을 선택해주세요!')
      if (!confirm('이 항목을 삭제하시겠습니까?')) return
      this.$store.dispatch(DELETE_REPORT, id) && this.$showSnackBar('삭제되었습니다!')
    },
    onChange (ev) {
      if (ev === undefined) return
      this.fetchReports(ev.code)
      sessionStorage.setItem('SMALL-CODE', ev.code)
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
</style>
