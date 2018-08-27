<template>
  <div class="tp-10">
    <!--<v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">봉사 활동 내역</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="dlgItem.content" label="관리자 성명"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="orange darken-1" outline flat
                   @click="dialog = false">취소</v-btn>
            <v-btn color="blue darken-1" outline flat
                   @click="saveItem">저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>-->
    <v-data-table :headers="headers" :items="admins" hide-actions class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.admin_id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.area_code }}</td>
          <td class="text-xs-center">{{ props.item.registered }}</td>
        </tr>
      </template>
    </v-data-table>
    <inline-buttons refs="admin"/>
  </div>
</template>

<script>
import InlineButtons from './control/InlineButtons'
// import DatePicker from './control/DatePicker'
// import {isEmpty, isUndefined} from 'lodash/lang'
// import {FETCH_VOLUNTEER_ACTS, CREATE_VOLUNTEER_ACT, UPDATE_VOLUNTEER_ACT, DELETE_VOLUNTEER_ACT} from '../store/actions.type'

// const DEFALUT_ITEM = {id: null, area_code: null, name: null, ca_name: null, registered: null}
export default {
  name: 'AdminList',
  components: { InlineButtons },
  data: () => ({
    selected: {},
    headers: [
      { text: '번호', align: 'center', value: 'id' },
      { text: '관리자 ID', align: 'center', value: 'admin_id' },
      { text: '관리자 성명', align: 'center', value: 'name' },
      { text: '관리자 세례명', align: 'center', value: 'ca_name' },
      { text: '구역코드', align: 'center', value: 'area_code' },
      { text: '등록일', align: 'center', value: 'registered' }
    ],
    admins: [
      {id: 123, admin_id: '은총', area_code: '01-002-003', name: '김성휘', ca_name: '베드로', registered: '2018-09-04'},
      {id: 456, admin_id: '봉사', area_code: '02-004-012', name: '강하나', ca_name: '소피아', registered: '2018-09-17'},
      {id: 789, admin_id: '소명', area_code: '01-024-002', name: '서예지', ca_name: '요세피나', registered: '2018-10-23'}
    ]
  }),
  created () {
    this.fetchData()

    // const _this = this
    this.$eventBus.$on('click-btn-admin', (eventType) => {
      if (eventType === 'add') {
      } else if (eventType === 'remove') {
        // if (isEmpty(_this.selected)) return alert('내역을 선택해주세요.')
        // return confirm('선택 항목을 삭제하시겠습니까?') && _this.deleteActItem(_this.selected.id)
      } else if (eventType === 'edit') {
        // if (isEmpty(_this.selected)) return alert('내역을 선택해주세요.')
      }
    })
  },
  methods: {
    saveItem () {
    },
    updateItem (item) {
      // this.$store.dispatch(UPDATE_VOLUNTEER_ACT, item)
    },
    deleteItem (id) {
      // this.$store.dispatch(DELETE_VOLUNTEER_ACT, id)
    },
    async fetchData () {
      this.selected = {}
      // await this.$store.dispatch(FETCH_VOLUNTEER_ACTS, this.vid)
    }
  }
}
</script>

<style scoped>
</style>
