<template>
  <v-container pt-4 pb-3 mt-2 elevation-3>
    <v-layout pb-2 pl-2>
      <v-flex xs2>
        <div>전체 이력 : {{volunteerLeader.length}} 건</div>
      </v-flex>
      <v-flex xs4>
        <slot name="voltInfo"></slot>
      </v-flex>
      <v-flex xs6>
        <div class="text-xs-right caption grey--text">※ 봉사자 기본 정보에서 대표자 정보 변경 시 자동 갱신됩니다.</div>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerLeader" hide-actions
                  class="elevation-1 mb-2" :loading="fetched && isLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr> <!--@click="selected = props.item" @dblclick="onClickMenu('update')"
            :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">-->
          <td class="text-xs-center">{{ props.item.idx }}</td>
          <td class="text-xs-center">{{ props.item.work === 'Y' ? '임기 중' : '임기 종료' }}</td>
          <td class="text-xs-center">{{ props.item.area_name }} 본당</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.period|period }}</td>
        </tr>
      </template>
      <template slot="no-data" v-show="fetched">
        <tr class="text-xs-center"><td colspan="6">대표 봉사자 이력이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <!--<v-layout row justify-end>
      <v-flex xs12 sm2 offset-sm4>
        <menu-buttons class="pt-0" refs="ldr" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <item-dialog ref="ldr" :visible="inputDlg" @close-input-item="onInputItem" refs="ldr"/>-->
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import DatePicker from './control/DatePicker'
import ItemDialog from './control/InputItemDialog'
import { isUndefined } from 'lodash/lang'
import { mapGetters } from 'vuex'
import { FETCH_VOLUNTEER_LEADER } from '../store/actions.type'

export default {
  name: 'VolunteerLeader',
  components: { DatePicker, MenuButtons, ItemDialog },
  props: { v_id: undefined },
  computed: {
    ...mapGetters([
      'actCodes',
      'volunteerLeader',
      'isVolunteersLoading'
    ]),
    isLoading () {
      return isUndefined(this.v_id) ? false : this.isVolunteersLoading
    }
  },
  data: () => ({
    items: [],
    selected: {},
    inputDlg: false,
    fetched: false,
    headers: [
      { text: '번호', value: 'idx' },
      { text: '활동 상태', value: 'work' },
      { text: '소속 구역', value: 'area_name' },
      { text: '선임 날짜', value: 's_date' },
      { text: '퇴임 날짜', value: 'e_date' },
      { text: '활동 기간', value: 'period' }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_LEADER, this.v_id)
      this.fetched = true
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.ldr.reset()
        // this.$refs.ldr.setItem({id: this.volunteerActs.length + 1})
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('이력을 선택해주세요!')
      if (type === 'remove') confirm('선택한 이력을 삭제하시겠습니까?') && this.deleteLdrItem(this.selected.id)
      else { // update
        this.$refs.ldr.setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      console.log('input item...', data)
      if (isUndefined(this.selected.id)) this.volunteerActs = data
      else this.updateLdrItem(data)
    }
  },
  filters: {
    period (val) {
      if (val < 0) return '-'
      const days = parseInt(val)
      const y = Math.floor(days / 365)
      const m = Math.floor((days % 365) / 30)
      const d = Math.floor((days % 365) % 30)
      let [ys, ms, ds] = ['', '', '']
      if (y > 0) ys = `${y}년 `
      if (m > 0) ms = `${m}개월 `
      if (d > 0) ds = `${d}일`
      return ys + ms + ds
    }
  }
}
</script>

<style scoped>
</style>
