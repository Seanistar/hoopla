<template>
  <v-container pt-4 pb-3 mt-2 elevation-3>
    <v-layout pb-2 pl-2>
      <v-flex xs12>
        <div>전체 교육 : {{volunteerEdus.length}} 건</div>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerEdus"
                  class="elevation-1 mb-2" hide-actions
                  :loading="fetched && isLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" @dblclick="onClickMenu('update')"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center w-10">{{ props.item.idx }}</td>
          <td class="text-xs-center w-20">{{ props.item.edu_name }}</td>
          <td class="text-xs-center w-15">{{ props.item.s_date }}</td>
          <td class="text-xs-center w-15">{{ props.item.e_date }}</td>
          <td class="text-xs-center w-20">{{ props.item.gv_name }}</td>
          <!--<td class="text-xs-center w-10">{{ props.item.numbers }}</td>-->
          <td class="text-xs-center w-20">{{ props.item.memo }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
        <tr class="text-xs-center"><td colspan="6">교육 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <v-layout row mt-3>
      <v-flex xs6 text-xs-left>
        <router-link :to="{name: 'view-query', params: {id: v_id, menu: 'm-0'}}" class="txt-deco-none" replace>
          <v-btn outline color="primary">조회 화면 이동</v-btn>
        </router-link>
      </v-flex>
      <v-flex xs6 sm2 offset-sm4>
        <menu-buttons class="pt-0" refs="edus" :disabled="isDisable" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <edus-dialog ref="edus" :visible="inputDlg" @close-input-item="onInputItem"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import EdusDialog from './control/InputEdusDialog'
import DatePicker from './control/DatePicker'
import { isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_EDUS, CREATE_VOLUNTEER_EDU, UPDATE_VOLUNTEER_EDU, DELETE_VOLUNTEER_EDU } from '../store/actions.type'

export default {
  name: 'VolunteerEdus',
  components: { EdusDialog, MenuButtons, DatePicker },
  props: { v_id: undefined },
  computed: {
    volunteerEdus () {
      return this.$store.getters.volunteerEdus
    },
    volunteerInfo () {
      return this.$store.getters.volunteerInfo(parseInt(this.v_id))
    },
    isLoading () {
      return isUndefined(this.v_id) ? false : this.$store.getters.isVolunteersLoading
    }
  },
  watch: {
    'selected.id' (val) {
      console.log(val)
    }
  },
  data: () => ({
    selected: {},
    inputDlg: false,
    fetched: false,
    isDisable: false,
    headers: [
      { text: '번호', value: 'idx' },
      { text: '교육 내용', value: 'edu_name' },
      { text: '교육 시작일', value: 's_date' },
      { text: '교육 종료일', value: 'e_date' },
      { text: '봉사자', value: 'v_name' },
      // { text: '인원 수', value: 'numbers' },
      { text: '참고 사항', value: 'memo', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    this.fetchData()
  },
  mounted () {
    if (!this.$parent.isAccessible()) this.isDisable = true
  },
  methods: {
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_EDUS, this.v_id)

      this.fetched = true
    },
    async createEduItem (item) {
      await this.$store.dispatch(CREATE_VOLUNTEER_EDU, item)
      setTimeout(() => {
        this.fetchData()
      }, 300)
    },
    async updateEduItem (item) {
      await this.$store.dispatch(UPDATE_VOLUNTEER_EDU, item)
      setTimeout(() => {
        this.fetchData()
      }, 300)
    },
    deleteEduItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_EDU, id)
      this.selected = {}
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.selected = {}
        this.$refs.edus.setItem(Object.assign({v_id: this.v_id}, this.$parent.VOLT))
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('교육 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 내역을 삭제하시겠습니까?') && this.deleteEduItem(this.selected.id)
      else { // update
        this.selected.edu_code = parseInt(this.selected.edu_code)
        this.$refs.edus.setItem(Object.assign(this.selected, this.$parent.VOLT))
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      if (isUndefined(data.v_id)) data.v_id = data.id
      console.log('input item...', data)
      if (isUndefined(this.selected.id)) this.createEduItem(data)
      else this.updateEduItem(data)
    }
  }
}
</script>

<style scoped>
</style>
