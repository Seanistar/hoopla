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
          <td class="text-xs-center">{{ props.item.idx }}</td>
          <td class="text-xs-center">{{ props.item.edu_name }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.gv_name }}</td>
          <td class="text-xs-center">{{ props.item.memo }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
        <tr class="text-xs-center"><td colspan="6">교육 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <v-layout row justify-end>
      <v-flex xs12 sm2 offset-sm4>
        <menu-buttons class="pt-0" refs="edus" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <item-dialog ref="edus" :visible="inputDlg" @close-input-item="onInputItem" refs="edus"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'
import DatePicker from './control/DatePicker'
import { isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_EDUS, CREATE_VOLUNTEER_EDU, UPDATE_VOLUNTEER_EDU, DELETE_VOLUNTEER_EDU } from '../store/actions.type'

export default {
  name: 'VolunteerEdus',
  components: { ItemDialog, MenuButtons, DatePicker },
  props: { v_id: undefined },
  computed: {
    volunteerEdus: {
      get () {
        return this.$store.getters.volunteerEdus
      },
      set (data) {
        this.$store.dispatch(CREATE_VOLUNTEER_EDU, data)
      }
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
    headers: [
      { text: '번호', value: 'idx' },
      { text: '교육 내용', value: 'edu_name' },
      { text: '교육 시작일', value: 's_date' },
      { text: '교육 종료일', value: 'e_date' },
      { text: '봉사자', value: 'v_name' },
      { text: '참고 사항', value: 'memo', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2'] })
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_EDUS, this.v_id)
      this.fetched = true
    },
    updateEduItem (item) {
      this.$store.dispatch(UPDATE_VOLUNTEER_EDU, item)
    },
    deleteEduItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_EDU, id)
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.edus.setItem(Object.assign({id: this.v_id}, this.$parent.getCore()))
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('교육 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 내역을 삭제하시겠습니까?') && this.deleteEduItem(this.selected.id)
      else { // update
        this.selected.edu_code = parseInt(this.selected.edu_code)
        this.$refs.edus.setItem(Object.assign(this.selected, this.$parent.getCore()))
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      if (isUndefined(data.v_id)) data.v_id = data.id
      console.log('input item...', data)
      if (isUndefined(this.selected.id)) this.volunteerEdus = data
      else this.updateEduItem(data)
    }
  }
}
</script>

<style scoped>
</style>
