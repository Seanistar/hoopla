<template>
  <v-container>
    <v-layout row justify-end>
      <v-flex xs12 sm2 offset-sm4>
        <menu-buttons class="pt-0 pb-1" refs="edus" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerEdus" hide-actions class="elevation-1"
                  :loading="fetched && isLoading"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.edu_name }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.v_name }}</td>
          <td class="text-xs-center">{{ props.item.memo }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
          교육 내역이 없습니다.
      </template>
    </v-data-table>
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
        return this.$store.state.volunteer.volunteerEdus
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
      { text: '번호', align: 'center', value: 'id' },
      { text: '교육 내용', align: 'center', value: 'subject' },
      { text: '교육 시작일', align: 'center', value: 's_date' },
      { text: '교육 종료일', align: 'center', value: 'e_date' },
      { text: '봉사자', align: 'center', value: 'v_name' },
      { text: '참고 사항', align: 'center', value: 'memo', sortable: false }
    ]
  }),
  created () {
    this.fetchData()
  },
  methods: {
    updateEduItem (item) {
      this.$store.dispatch(UPDATE_VOLUNTEER_EDU, item)
    },
    deleteEduItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_EDU, id)
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs['edus'].reset()
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('교육 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 내역을 삭제하시겠습니까?') && this.deleteEduItem(this.selected.id)
      else { // update
        this.$refs['edus'].setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      console.log('input item...', data)
      if (isUndefined(this.selected.id)) this.volunteerEdus = data
      else this.updateEduItem(data)
    },
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_EDUS, this.v_id)
      this.fetched = true
    }
  }
}
</script>

<style scoped>
</style>
