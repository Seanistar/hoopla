<template>
  <v-container>
    <v-layout row justify-end>
      <v-flex xs12 sm2 offset-sm4>
        <menu-buttons class="pt-0 pb-1" refs="acts" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerActs"
                  hide-actions class="elevation-1" :loading="fetched && isLoading"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.grp_name }}</td>
          <td class="text-xs-center">{{ props.item.grp_count }}</td>
          <td class="text-xs-center">{{ props.item.numbers }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.area_code }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
          봉사 활동 내역이 없습니다.
      </template>
    </v-data-table>
    <item-dialog ref="acts" :visible="inputDlg" @close-input-item="onInputItem" refs="acts"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import DatePicker from './control/DatePicker'
import ItemDialog from './control/InputItemDialog'
import { isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_ACTS, CREATE_VOLUNTEER_ACT, UPDATE_VOLUNTEER_ACT, DELETE_VOLUNTEER_ACT } from '../store/actions.type'

export default {
  name: 'VolunteerActs',
  components: { DatePicker, MenuButtons, ItemDialog },
  props: { v_id: undefined },
  computed: {
    volunteerActs: {
      get () {
        return this.$store.state.volunteer.volunteerActs
      },
      set (data) {
        this.$store.dispatch(CREATE_VOLUNTEER_ACT, data)
      }
    },
    volunteerInfo () {
      return this.$store.getters.volunteerInfo(parseInt(this.v_id))
    },
    isLoading () {
      return isUndefined(this.v_id) ? false : this.$store.getters.isVolunteersLoading
    },
    actCodes () {
      return this.$store.getters.actCodes
    }
  },
  data: () => ({
    selected: {},
    inputDlg: false,
    fetched: false,
    headers: [
      { text: '번호', align: 'center', value: 'id' },
      { text: '봉사 단체', align: 'center', value: 'grp_name' },
      { text: '그룹 수', align: 'center', value: 'grp_count' },
      { text: '구성원 수', align: 'center', value: 'numbers' },
      { text: '시작일', align: 'center', value: 's_date' },
      { text: '종료일', align: 'center', value: 'e_date' },
      { text: '활동 본당', align: 'center', value: 'area_code', sortable: false },
      { text: '활동 내용', align: 'center', value: 'content', sortable: false }
    ]
  }),
  created () {
    this.fetchData()
  },
  methods: {
    updateActItem (item) {
      this.$store.dispatch(UPDATE_VOLUNTEER_ACT, item)
    },
    deleteActItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_ACT, id)
    },
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_ACTS, this.v_id)
      this.fetched = true
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs['acts'].reset()
        // this.$refs['acts'].setItem({id: this.volunteerActs.length + 1})
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사 내역을 삭제하시겠습니까?') && this.deleteActItem(this.selected.id)
      else { // update
        this.$refs['acts'].setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      console.log('input item...', data)
      if (isUndefined(this.selected.id)) this.volunteerActs = data
      else this.updateActItem(data)
    }
  }
}
</script>

<style scoped>
</style>
