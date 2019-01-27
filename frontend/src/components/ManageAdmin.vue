<template>
  <v-container class="elevation-2 mt-3 pt-1">
    <v-layout row align-baseline>
      <v-flex xs12 sm3>
        <!--<v-text-field label="편집할 항목을 선택하세요." single-line readonly value=""></v-text-field>-->
      </v-flex>
      <v-flex xs12 sm2 offset-sm7>
        <menu-buttons refs="admin" class="mb-1" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="admins" hide-actions
                  class="elevation-5">
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.admin_id }}</td>
          <td class="text-xs-center">{{ props.item.admin_name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.area_name }}</td>
          <td class="text-xs-center">{{ props.item.reg_date }}</td>
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
import { find } from 'lodash/collection'
import { pick, omit } from 'lodash/object'
import { mapGetters, mapActions } from 'vuex'
import { FETCH_ADMINS, REGISTER_ADMIN, UPDATE_ADMIN, DELETE_ADMIN } from '../store/actions.type'

export default {
  name: 'AdminList',
  components: { MenuButtons, ItemDialog },
  computed: {
    ...mapGetters([
      'admins',
      'areaCodes',
      'isAdminLoading'
    ])
  },
  data: () => ({
    selected: {},
    inputDlg: false,
    headers: [
      { text: '관리 번호', value: 'id' },
      { text: '관리자 ID', value: 'admin_id' },
      { text: '관리자 성명', value: 'name' },
      { text: '관리자 세례명', value: 'ca_name' },
      { text: '구역 이름', value: 'area_name' },
      { text: '등록일', value: 'registered' }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })

    this.fetchData()
  },
  methods: {
    ...mapActions([
      FETCH_ADMINS,
      REGISTER_ADMIN,
      UPDATE_ADMIN,
      DELETE_ADMIN
    ]),
    async fetchData () {
      this.selected = {}
      await this[FETCH_ADMINS]()
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.admin.setItem()
        this.inputDlg = true
        return
      }
      if (isEmpty(this.selected)) return alert('관리자를 선택해주세요!')
      if (type === 'remove') confirm('선택한 관리자를 정말 삭제하시겠습니까?') && this.deleteItem(this.selected.id)
      else if (type === 'edit') { // update
        this.$refs.admin.setItem(omit(this.selected, ['password']))
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      data.area_code = data.s_code
      data = pick(data, ['area_code', 'admin_id', 'id', 'admin_name', 'ca_name', 'password'])
      console.log('input item...', data)
      // if (!data.password) return this.$showSnackBar('비밀번호를 입력해주세요.')
      this.updateItem(data)
    },
    async updateItem (item) {
      if (item.id === undefined) {
        const one = find(this.admins, a => item.admin_id.indexOf(a.admin_id) >= 0)
        if (one) return this.$showSnackBar('동일한 ID가 존재합니다!')
        const area = find(this.areaCodes, (o) => o.a_code === item.area_code)
        if (area) item.area_name = `${area.l_name} 교구 / ${area.s_name} 본당`

        await this[REGISTER_ADMIN](item)
        this.$showSnackBar('추가되었습니다.')
      } else {
        await this[UPDATE_ADMIN](item)
        this.$showSnackBar('수정되었습니다.')
      }
    },
    deleteItem (id) {
      this[DELETE_ADMIN](id)
    }
  }
}
</script>

<style scoped>
</style>
