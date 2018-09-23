<template>
  <v-container class="elevation-2 mt-3 pt-1">
    <v-layout row align-baseline>
      <v-flex xs12 sm3>
        <v-text-field label="편집할 항목을 선택하세요." single-line readonly value=""></v-text-field>
      </v-flex>
      <v-flex xs12 sm2 offset-sm7>
        <menu-buttons refs="admin" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="admins" hide-actions
                  class="elevation-5">
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.admin_id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.area_name }}</td>
          <td class="text-xs-center">{{ props.item.registered }}</td>
        </tr>
      </template>
    </v-data-table>
    <item-dialog ref="admin" :visible="inputDlg" @close-input-item="onInputItem" refs="admin" />
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'
import { isEmpty } from 'lodash/lang'
// import {FETCH_ADMINS, CREATE_ADMIN, UPDATE_ADMIN, DELETE_ADMIN} from '../store/actions.type'

export default {
  name: 'AdminList',
  components: { MenuButtons, ItemDialog },
  data: () => ({
    selected: {},
    inputDlg: false,
    headers: [
      { text: '관리 번호', value: 'id' },
      { text: '관리자 ID', value: 'admin_id' },
      { text: '관리자 성명', value: 'name' },
      { text: '관리자 세례명',value: 'ca_name' },
      { text: '구역코드', value: 'area_code' },
      { text: '등록일', value: 'registered' }
    ],
    admins: [
      {id: 123, admin_id: '은총', area_name: '01-02-03', name: '김성휘', ca_name: '베드로', registered: '2018-09-04'},
      {id: 456, admin_id: '봉사', area_name: '02-04-12', name: '강하나', ca_name: '소피아', registered: '2018-09-17'},
      {id: 789, admin_id: '소명', area_name: '01-04-02', name: '서예지', ca_name: '요세피나', registered: '2018-08-15'},
      {id: 1592, admin_id: 'bible', area_name: '01-14-01', name: '김효진', ca_name: '유스티나', registered: '2018-08-03'},
      {id: 2154, admin_id: 'bibleClass', area_name: '01-15-02', name: '최우빈', ca_name: '베네딕토', registered: '2018-07-19'}
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.selected = {}
      // await this.$store.dispatch(FETCH_ADMINS)
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.admin.setItem()
        this.inputDlg = true
        return
      }
      if (isEmpty(this.selected)) return alert('관리자를 선택해주세요!')
      if (type === 'remove') confirm('선택한 관리자를 정말 삭제하시겠습니까?') && this.deleteItem()
      else if (type === 'edit') { // update
        this.$refs.admin.setItem()
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      [data.type, data.code] = data.code.split('-')
      console.log('input item...', data)
      this.updateItem(data)
      this.$showSnackBar('처리되었습니다!')
    },
    updateItem (item) {
      // this.$store.dispatch(UPDATE_ADMIN, item)
    },
    deleteItem (id) {
      // this.$store.dispatch(DELETE_ADMIN, id)
    }
  }
}
</script>

<style scoped>
</style>
