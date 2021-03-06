<template>
  <v-container class="elevation-5 pt-3">
    <v-layout row align-baseline pb-0>
      <v-flex :class="winWidth >= 900 ? 'xs10' : 'xs12'">
        <v-layout row align-baseline>
          <v-flex xs4>
            <v-combobox class="body-2" v-model="model"
                        @input="fetchVolunteers()" label="소속 본당"
                        :items="items" item-value="code" item-text="name"
                        :search-input.sync="search" clearable>
            </v-combobox>
          </v-flex>
          <v-flex xs4>
            <v-text-field class="body-2 ml-3" v-model="voltName"
                        @keyup.enter="fetchVolunteers()" label="봉사자 이름" clearable>
            </v-text-field>
          </v-flex>
          <v-flex xs4 ml-3 body-1 v-if="winWidth >= 900">
            <span>봉사자 수 - 전체: <b>{{totalCount|units}}</b> 명</span>
            <span v-if="fetched && (search || voltName)"> / 현재 검색: <b>{{volunteersCount|units}}</b> 명</span>
          </v-flex>
          <v-flex ml-2 v-else>
            <span>현재: <b>{{totalCount|units}}</b> 명</span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs2 v-if="winWidth >= 900">
        <v-layout justify-end>
          <v-btn color="green" outline @click="toExcel">내려받기</v-btn>
          <v-btn color="indigo accent-2" outline dark class="mb-3" @click="newVolunteer">신규 봉사자</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="isVolunteersLoading && !fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :headers="headers" :items="volunteers" hide-actions
                  disable-initial-sort :pagination.sync="pagination" :rows-per-page-items="perPage">
      <template slot="items" slot-scope="props">
        <tr class="first-row" @dblclick="editItem(props.item)">
          <td class="text-xs-center" style="padding: 0 10px"><span>{{(props.index + 1)}}</span></td>
          <td class="text-xs-center" style="cursor: pointer">
            <span>{{ props.item.name }}</span>
            <v-badge color="orange" class="badge-pos"
                     overlap v-show="props.item.is_leader === 'Y'">
              <v-icon slot="badge" small>face</v-icon>
            </v-badge>
          </td>
          <td class="text-xs-center" style="cursor: pointer">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ activityState[props.item.state] }}</td>
          <td class="text-xs-center">{{ props.item.sa_name }}</td>
          <td class="text-xs-center">{{ props.item.au_date }}</td>
          <td class="text-xs-center">{{ props.item.br_date }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-4" @click.self="deleteItem(props.item)">delete</v-icon>
            <v-icon small @click.self="editItem(props.item)">edit</v-icon>
          </td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
        <v-alert :value="true" color="warning" icon="warning">
          표시할 봉사자 정보가 없습니다.
        </v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_VOLUNTEERS, DELETE_VOLUNTEER, FETCH_SMALL_LEADER, GET_TOTAL_COUNT } from '@/store/actions.type'
import { SET_CHANGED_CODE } from '@/store/mutations.type'
import XLSX from 'xlsx'
import { map, find, orderBy } from 'lodash/collection'

export default {
  name: 'VolunteerList',
  data: () => ({
    items: [],
    model: null,
    search: null,
    voltName: null,
    fetched: false,
    winWidth: 0,
    pagination: {rowsPerPage: 100},
    perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
    headers: [
      { text: '번호', value: 'id', sortable: false },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '활동상태', value: 'area_code' },
      { text: '소속본당', value: 'sa_name' },
      { text: '선서일', value: 'au_date' },
      { text: '생년월일', value: 'br_date' },
      { text: '편집', value: 'edit', sortable: false }
    ]
  }),
  watch: {
    voltName (nv, ov) {
      (ov && !nv) && this.fetchVolunteers()
    }
  },
  computed: {
    ...mapGetters([
      'smallCodes',
      'areaCodes',
      'authInfo',
      'volunteers',
      'volunteersCount',
      'changedChurchCode',
      'totalCount',
      'isVolunteersLoading'
    ]),
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망', SBB: '안식년' }
    }
  },
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    this.winWidth = window.innerWidth
  },
  methods: {
    async fetchVolunteers (code) {
      this.fetched = false
      let reqCode = code !== undefined ? code : (this.model ? this.model.code : '')
      const params = {code: reqCode, name: this.voltName}

      await this.$store.dispatch(GET_TOTAL_COUNT)
      await this.$store.dispatch(FETCH_VOLUNTEERS, {params})

      this.fetched = true
      this.$store.commit(SET_CHANGED_CODE, reqCode)
    },
    newVolunteer () {
      // if (!this.model || !this.model.code) return alert('본당을 선택하세요!')
      // await this.$store.dispatch(FETCH_SMALL_LEADER, this.model.code)
      this.$router.push({name: 'edit-volunteer'})
    },
    editItem (item) {
      if (!item.area_code) return alert('본당을 선택하세요!')
      this.$store.dispatch(FETCH_SMALL_LEADER, item.area_code)
      this.$router.push({name: 'edit-volunteer', params: {id: item.id, item: item}})
    },
    deleteItem (item) {
      confirm('해당 봉사자의 활동 기록 모두가 사라집니다. \n삭제하시겠습니까?') && this.$store.dispatch(DELETE_VOLUNTEER, item.id)
    },
    setLastChangedCode () {
      let code = this.changedChurchCode
      if (!code) code = this.authInfo.area_code

      setTimeout(() => {
        this.setCodeInfo(code)
        this.fetchVolunteers(code)
      }, 600)
    },
    async setCodeInfo (code) {
      if (!this.areaCodes.length) await this.$store.dispatch('fetchAreaCodes')
      const list = map(this.smallCodes(null), o => {
        const full = `${o.s_name} (${o.l_name}-${o.m_name})`
        return {code: o.s_code, name: full}
      })
      this.items = orderBy(list, ['name'])

      const res = find(list, o => o.code === code)
      res && this.$nextTick(() => {
        this.model = {name: res.name, code: res.code}
      })
    },
    toExcel () {
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[0], {raw: true})
      XLSX.writeFile(wb, '봉사자정보입력.xlsx')
    }
  },
  filters: {
    units (x) {
      if (!Number.isInteger(x) || Number.isNaN(x)) return x
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped>
  .badge-pos {
    top: -15px;
    right: -15px
  }
</style>
