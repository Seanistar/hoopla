<template>
  <v-container pt-2 pb-2>
    <v-layout row wrap align-center mb-1>
      <v-flex xs3>
        <v-subheader class="subheading font-weight-bold pr-0">{{small.nm}} 본당
        </v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-subheader class="body-2 justify-end"><span class="mr-2">대표 봉사자 :</span>
          <input :value="smallLeader.lv_name" class="pa-1 input-box">
        </v-subheader>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="items" hide-actions item-key="idx"
                  class="elevation-5" :loading="fetched && isReportsLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="forked = props.item; selected = {}; props.expanded = !props.expanded">
          <td class="text-xs-center w-10">{{ props.item.idx }}</td>
          <td class="text-xs-center w-20">{{ props.item.name }}</td>
          <td class="text-xs-center w-20">{{ props.item.ca_name }}</td>
          <td class="text-xs-center w-20">{{ props.item.act_name }}</td>
          <td class="text-xs-center w-15">{{ props.item.groups }}</td>
          <td class="text-xs-center w-15">{{ props.item.numbers }}</td>
          <!--<td class="text-xs-center">{{ props.item.s_date }}</td>-->
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-text class="py-0">
            <v-data-table :items="details" hide-actions>
              <template slot="headers" slot-scope="header">
                <tr style="background-color: beige">
                  <th>참여 인원 수</th>
                  <th>시작 날짜</th>
                  <th>종료 날짜</th>
                  <th>활동 내용</th>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr @click="selected = props.item" @dblclick="onClickMenu('update')"
                    :style="{backgroundColor: (selected.id && selected.id === props.item.id ? 'orange' : 'white')}">
                  <td class="text-xs-center">{{ props.item.numbers }}</td>
                  <td class="text-xs-center">{{ props.item.s_date }}</td>
                  <td class="text-xs-center">{{ props.item.e_date }}</td>
                  <td class="text-xs-center">{{ props.item.content }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">봉사 내역이 없습니다.</div>
      </template>
    </v-data-table>
    <v-layout justify-end pt-2 pb-0>
      <v-flex xs12>
        <menu-buttons :disabled="!isEnabled" @click-menu="onClickMenu" refs="acts" />
      </v-flex>
    </v-layout>
    <acts-dialog ref="acts" :visible="inputDlg" @close-input-item="onInputItem" refs="report"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ActsDialog from './control/InputActsDialog'
import { pick } from 'lodash/object'
import { isEmpty } from 'lodash/lang'
import { groupBy, map, reduce } from 'lodash/collection'
import {
  FETCH_REPORT_ACTS,
  CREATE_REPORT_ACT,
  UPDATE_REPORT_ACT,
  DELETE_REPORT_ACT,
  FETCH_SMALL_LEADER
} from '@/store/actions.type'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ReportActs',
  components: { MenuButtons, ActsDialog },
  computed: {
    ...mapGetters([
      'reportActs',
      'isReportsLoading',
      'actCodes',
      'smallLeader'
    ]),
    details () {
      return this.reportActs.filter(o => o.v_a_c === this.forked.v_a_c)
    },
    isEditable () {
      const thisYear = (new Date()).getFullYear()
      const endYear = parseInt(this.$parent.E_DATE.slice(0, 4))
      return thisYear !== endYear
    }
  },
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    const res = this.$parent.getSmall()
    if (res) {
      if (isEmpty(this.smallLeader)) this[FETCH_SMALL_LEADER](res.s_code)
      this.small.nm = res.s_name
      this.fetchData(this.small.cd = res.s_code)
    }
  },
  data: () => ({
    items: [],
    selected: {},
    forked: {},
    inputDlg: false,
    fetched: false,
    isEnabled: true,
    small: { nm: '', cd: '' },
    headers: [
      { text: '번호', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '봉사 활동명', value: 'act_name' },
      { text: '그룹 수', value: 'groups' },
      { text: '총 인원', value: 'numbers' }
    ]
  }),
  methods: {
    ...mapActions([
      FETCH_REPORT_ACTS,
      CREATE_REPORT_ACT,
      UPDATE_REPORT_ACT,
      DELETE_REPORT_ACT,
      FETCH_SMALL_LEADER
    ]),
    async fetchData (code) {
      const [sd, ed] = [this.$parent.S_DATE, this.$parent.E_DATE]
      await this[FETCH_REPORT_ACTS]({a_code: code, s_date: sd, e_date: ed})
      if (!this.$parent.isAccessible(code)) this.isEnabled = false
      this.fetched = true
      this.mapData()
    },
    mapData () {
      const list = groupBy(this.reportActs, 'v_a_c')
      let i = 1
      const mapped = map(list, (ol) => {
        let obj = { idx: i++, groups: ol.length }
        obj['numbers'] = this.sumNumbers(ol)
        Object.assign(obj, pick(ol[0], ['name', 'ca_name', 'act_name', 'v_a_c']))
        return obj
      })
      this.items = mapped
    },
    sumNumbers (list) {
      return reduce(list, (t, v) => {
        let n = +v.numbers
        return t + n
      }, 0)
    },
    async deleteActItem (id) {
      await this[DELETE_REPORT_ACT](id)
      this.$nextTick(() => {
        this.fetchData(this.small.cd)
        // this.mapData()
      })
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.selected = {}
        this.$refs.acts.setItem({s_name: this.small.nm, s_code: this.small.cd, id: 0})
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사 내역을 삭제하시겠습니까?') && this.deleteActItem(this.selected.id)
      else { // update
        this.selected.act_code = parseInt(this.selected.act_code)
        this.selected.s_name = this.small.nm
        this.$refs.acts.setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      if (data.v_id === undefined) data.v_id = data.id
      const item = pick(data, ['id', 'v_id', 'act_code', 'act_name', 'name', 'ca_name', 'area_code', 's_date', 'e_date', 'content', 'numbers'])
      console.log('input item...', item)
      this.updateActItem(item)
    },
    async updateActItem (data) {
      if (this.selected.id === undefined) {
        data.v_a_c = `${data.v_id}-${data.act_code}`
        await this[CREATE_REPORT_ACT](data)
        this.$showSnackBar('추가되었습니다.')
      } else {
        await this[UPDATE_REPORT_ACT](data)
        this.$showSnackBar('수정되었습니다.')
      }

      this.$nextTick(() => {
        this.fetchData(this.small.cd)
        // this.mapData()
      })
    }
  }
}
</script>

<style scoped>
</style>
