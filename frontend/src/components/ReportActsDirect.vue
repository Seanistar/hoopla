<template>
  <v-container pt-2 pb-3>
    <v-layout row wrap align-center mb-1>
      <v-flex :class="$parent.winWidth < 600 ? 'xs12' : 'xs3'">
        <v-subheader class="subheading font-weight-bold pr-0">{{small.nm}} 본당 ({{reportYear}})
        </v-subheader>
      </v-flex>
      <!--<v-flex xs9>
        <v-subheader class="body-2 justify-end"><span class="mr-2">대표 봉사자 :</span>
          <input :value="smallLeader.lv_name" class="pa-1 input-box">
        </v-subheader>
      </v-flex>-->
    </v-layout>
    <v-layout>
      <table class="mt-2 mb-3">
        <thead>
          <tr><td v-for="(h, n) in headers" :key="n">{{h.text}}</td></tr>
        </thead>
        <tbody v-if="actItems.length">
          <tr v-for="(at, n) in actItems" :key="n">
            <td style="width: 3%" :style="{backgroundColor: isFromOther(at) ? 'orange': ''}">{{n+1}}</td>
            <td style="width: 10%" v-if="isFromOther(at)">
              <v-text-field flat solo hide-details disabled :value="at.name"></v-text-field>
            </td>
            <td style="width: 10%" v-else>
              <v-select :items="voltList" item-text="name" item-value="id"
                          v-model="at.v_id" @change="onChangeName(at)" flat solo box hide-details></v-select>
            </td>
            <td style="width: 15%">
              <v-text-field flat solo hide-details :disabled="isFromOther(at)" v-model="at.ca_name"></v-text-field>
            </td>
            <td style="width: 12%">
              <v-select :items="codeList" item-text="name" item-value="code"
                          v-model="at.act_code" :disabled="isFromOther(at)" flat solo box hide-details></v-select>
            </td>
            <td style="width: 11%">
              <v-text-field flat solo hide-details :disabled="isFromOther(at)" style="margin: 0 15%"
                              v-model="at.numbers" @focus="onFocusNumber(at)"></v-text-field>
            </td>
            <td style="width: 8%">
              <v-text-field flat solo hide-details :disabled="isFromOther(at)" mask="####-##-##"
                            v-model="at.s_date" @blur="at.s_date = makeToDate($event, true)"></v-text-field>
            </td>
            <td style="width: 8%">
              <v-text-field flat solo hide-details :disabled="isFromOther(at)" mask="####-##-##"
                            v-model="at.e_date" @blur="at.e_date = makeToDate($event, false)"></v-text-field>
            </td>
            <td style="width: 13%">
              <v-radio-group v-model="at.group_type" :disabled="isFromOther(at)" row hide-details class="px-3">
                <v-radio label="낮반" value="D"></v-radio>
                <v-radio label="직장인반" value="N"></v-radio>
              </v-radio-group>
            </td>
            <template v-if="isFromOther(at)">
              <td colspan="2">{{at.church_name}}</td>
            </template>
            <template v-else>
              <td style="width: 4%"><span v-if="!isFromOther(at)"><v-icon @click="deleteAct(n, at.id)">delete</v-icon></span></td>
              <td style="width: 4%"><span v-if="!isFromOther(at)"><v-icon @click="moveToQuery(at.v_id)">forward</v-icon></span></td>
            </template>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td colspan="10" class="text-xs-center py-3">봉사 내역이 없습니다.</td></tr>
        </tbody>
      </table>
    </v-layout>
    <v-layout align-center justify-center class="progress-circular" v-if="!fetched">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>
    <v-layout v-if="$parent.winWidth >= 600">
      <v-flex xs6 text-xs-left><v-btn large outline @click="addRows">행 추가</v-btn></v-flex>
      <v-flex xs6 text-xs-right><v-btn large outline color="primary" @click="doneList"><b>저장</b></v-btn></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash/lang'
import { map, forEach, find, orderBy } from 'lodash/collection'
import { mapGetters } from 'vuex'
import {
  FETCH_REPORT_ACTS,
  DELETE_VOLUNTEER_ACT,
  FETCH_VOLUNTEERS,
  CREATE_VOLUNTEER_ACT,
  UPDATE_VOLUNTEER_ACT
} from '@/store/actions.type'

const ACTION = {
  act_code: '',
  area_code: '',
  ca_name: '',
  name: '',
  s_date: null,
  e_date: null,
  numbers: 0,
  content: ''
}
export default {
  name: 'ReportActsDirect',
  computed: {
    ...mapGetters([
      'reportActs',
      'actCodes',
      'volunteers'
    ]),
    voltList () {
      return orderBy(map(this.volunteers, v => {
        return {id: v.id, name: v.name, ca_name: v.ca_name}
      }), ['name'])
    },
    codeList () {
      return map(this.actCodes, a => {
        return {name: a.name, code: a.code.toString()}
      })
    }
  },
  data: () => ({
    actItems: [],
    originActs: [],
    reportYear: '',
    fetched: false,
    small: { nm: '', cd: '' },
    headers: [
      { text: '번호', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '그룹명', value: 'act_name' },
      { text: '인원수(명)', value: 'groups' },
      { text: '시작일', value: 's_date' },
      { text: '종료일', value: 'e_date' },
      { text: '활동 구분', value: 'group_type' },
      { text: '삭제', value: '' },
      { text: '이동', value: '' }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    const res = this.$parent.getSmall()
    if (res) {
      this.small.nm = res.s_name
      this.fetchData(this.small.cd = res.s_code)
    }
    this.reportYear = parseInt(this.$parent.E_DATE.slice(0, 4))
  },
  methods: {
    async fetchData (code) {
      this.fetched = false
      const [sd, ed] = [this.$parent.S_DATE, this.$parent.E_DATE]
      await this.$store.dispatch(FETCH_REPORT_ACTS, {a_code: code, s_date: sd, e_date: ed})

      const params = {code: this.small.cd}
      await this.$store.dispatch(FETCH_VOLUNTEERS, {params})

      this.actItems = this.reportActs
      this.originActs = cloneDeep(this.reportActs)
      this.fetched = true
    },
    addRows () {
      let newActs = []
      for (let i = 0; i < 5; i++) {
        const act = cloneDeep(ACTION)
        newActs.push(act)
      }
      this.actItems = this.actItems.concat(newActs)
    },
    doneList () {
      const res = find(this.actItems, a => a.v_id && a.s_date === null)
      if (res) return this.$showSnackBar('시작일이 없는 내역은 저장되지 않습니다.')

      let isDone = false
      forEach(this.actItems, async (a, idx) => {
        if (!a.v_id) return
        if (!a.e_date) a.e_date = this.$parent.E_DATE
        if (!a.id) {
          a.area_code = this.small.cd
          await this.$store.dispatch(CREATE_VOLUNTEER_ACT, a)
          isDone = true
        } else {
          if (!isEqual(a, this.originActs[idx])) {
            await this.$store.dispatch(UPDATE_VOLUNTEER_ACT, a)
            isDone = true
          }
        }
      })
      setTimeout(() => this.fetchData(this.small.cd), 500)
      isDone && this.$showSnackBar('저장되었습니다.')
    },
    deleteAct (idx, id) {
      if (!confirm('삭제하시겠습니까?')) return
      this.actItems.splice(idx, 1)
      id && this.$store.dispatch(DELETE_VOLUNTEER_ACT, id)

      this.$showSnackBar('삭제되었습니다.')
      // setTimeout(() => this.fetchData(this.small.cd), 100)
    },
    onChangeName (obj) {
      const res = find(this.voltList, v => v.id === obj.v_id)
      obj.ca_name = res ? res.ca_name : ''
    },
    moveToQuery (id) {
      this.$router.push({name: 'view-query', params: {id: id, menu: 'm-0'}})
    },
    makeToDate (event, isStart) {
      let date = event.target.value
      date = date.replace(/-/g, '')
      if (date.length === 0) return isStart ? this.$parent.S_DATE : this.$parent.E_DATE
      else if (date.length <= 4) return date + (isStart ? '0101' : '0831')
      else if (date.length <= 6) return date + (isStart ? '01' : '28')
      return date
    },
    onFocusNumber (src) {
      if (src.numbers === 0) src.numbers = null
    },
    isFromOther (item) {
      if (!item.other_code) return false
      return item.area_code !== this.small.cd
    }
  }
}
</script>

<style scoped>
  table {
    width: 100%;
    margin: 0 auto;
  }
  table, td, th {
    border: 1px solid grey;
    border-collapse: collapse;
    text-align: center;
  }
  td:nth-child(2) {
    width: 13%;
    padding: 5px;
  }
  td input {
    text-align: right;
  }
  .v-icon {
    cursor: pointer;
  }
</style>
