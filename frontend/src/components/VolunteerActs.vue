<template>
  <v-container pt-2 pb-3 mt-2 elevation-3>
    <v-layout pb-2 pl-2 align-center>
      <v-flex :class="$parent.winWidth < 900 ? 'xs4' : 'xs2'">
        <div>전체 봉사 : {{volunteerActs.length}} 건</div>
      </v-flex>
      <v-flex :class="$parent.winWidth < 900 ? 'xs8' : 'xs4'">
        <slot name="voltInfo"></slot>
      </v-flex>
      <v-flex xs6 text-xs-right v-if="$parent.winWidth >= 600">
        <menu-buttons class="pt-0" :disabled="isDisable" @click-menu="onClickMenu" refs="acts"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerActs"
                  class="elevation-1 mb-2" hide-actions
                  :loading="fetched && isLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" @dblclick="onClickMenu('update')"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center w-10">{{ props.item.idx }}</td>
          <td class="text-xs-center w-10">{{ props.item.act_name }}</td>
          <td class="text-xs-center w-10">{{ props.item.numbers }}명</td>
          <td class="text-xs-center w-15">{{ props.item.s_date }}</td>
          <td class="text-xs-center w-15">{{ props.item.e_date }}</td>
          <td class="text-xs-center w-15">{{ props.item.other_name || props.item.s_name }} 본당</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
        <tr class="text-xs-center"><td colspan="8">봉사 활동 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <v-layout row mt-3 v-if="$parent.winWidth >= 900">
      <v-flex xs6 text-xs-left>
        <router-link :to="{name: 'view-query', params: {id: v_id, menu: 'm-4'}}" class="txt-deco-none" replace>
          <v-btn outline color="primary">조회 화면 이동</v-btn>
        </router-link>
      </v-flex>
      <v-flex xs6 sm2 offset-sm4>
        <menu-buttons class="pt-0" :disabled="isDisable" @click-menu="onClickMenu" refs="acts"/>
      </v-flex>
    </v-layout>
    <acts-dialog ref="acts" :visible="inputDlg" @close-input-item="onInputItem" refs="volunteer"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import DatePicker from './control/DatePicker'
import ActsDialog from './control/InputActsDialog'
import { isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_ACTS, CREATE_VOLUNTEER_ACT, UPDATE_VOLUNTEER_ACT, DELETE_VOLUNTEER_ACT } from '../store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'VolunteerActs',
  components: { DatePicker, MenuButtons, ActsDialog },
  props: { v_id: undefined },
  computed: {
    ...mapGetters([
      'volunteerActs',
      'isVolunteersLoading',
      'actCodes'
    ]),
    volunteerInfo () {
      return this.$store.getters.volunteerInfo(parseInt(this.v_id))
    },
    isLoading () {
      return isUndefined(this.v_id) ? false : this.isVolunteersLoading
    }
  },
  data: () => ({
    selected: {},
    inputDlg: false,
    fetched: false,
    isDisable: false,
    headers: [
      { text: '번호', value: 'idx' },
      { text: '봉사 그룹', value: 'act_name' },
      { text: '구성원 수', value: 'numbers' },
      { text: '시작일', value: 's_date' },
      { text: '종료일', value: 'e_date' },
      { text: '활동 구역', value: 's_name' },
      { text: '활동 내용', value: 'content', sortable: false }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-1', 'pl-39x'] })
    this.fetchData()
  },
  mounted () {
    if (!this.$parent.isAccessible()) this.isDisable = true
  },
  methods: {
    async fetchData () {
      this.selected = {}
      this.v_id && await this.$store.dispatch(FETCH_VOLUNTEER_ACTS, this.v_id)
      this.fetched = true
    },
    async updateActItem (item) {
      if (isUndefined(this.selected.id)) {
        const res = this.actCodes.find(a => a.code === item.act_code)
        res && (item.act_name = res.name)
        await this.$store.dispatch(CREATE_VOLUNTEER_ACT, item)
        this.$showSnackBar('추가되었습니다.')
      } else {
        await this.$store.dispatch(UPDATE_VOLUNTEER_ACT, item)
        this.$showSnackBar('수정되었습니다.')
      }
      setTimeout(() => {
        this.fetchData()
      }, 300)
    },
    deleteActItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_ACT, id)
      this.selected = {}
      this.$showSnackBar('삭제되었습니다.')
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.selected = {}
        const obj = Object.assign({id: this.v_id}, this.$parent.VOLT, {s_code: this.volunteerInfo.area_code, s_name: this.volunteerInfo.sa_name})
        this.$refs.acts.setItem(obj)
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사 내역을 삭제하시겠습니까?') && this.deleteActItem(this.selected.id)
      else { // update
        this.selected.act_code = parseInt(this.selected.act_code)
        Object.assign(this.selected, this.$parent.VOLT)
        this.$refs.acts.setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      if (isUndefined(data.v_id)) data.v_id = data.id
      // console.log('input item...', data, data.area_code, data.s_code)
      this.updateActItem(data)
    }
  }
}
</script>

<style scoped>
  .w-5 {
    width: 5%;
  }
</style>
