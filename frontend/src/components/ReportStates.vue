<template>
  <v-container pt-2>
    <v-layout row wrap align-end>
      <v-flex xs12>
        <v-layout row wrap pb-0>
          <v-subheader class="subheading font-weight-bold w-16 pl-1 pr-0">{{states.ro.s_name}} 본당
          </v-subheader>
          <v-subheader class="body-2 w-24 pr-0"><span class="mr-2">작성자 :</span>
            <input v-model="states.ro.name" tag="rb"
                   placeholder="예) 김대건 안드레아" class="pa-1 input-box text-xs-center">
          </v-subheader>
          <v-subheader class="body-2 w-24 pr-0"><span class="mr-2">연락처 :</span>
            <input v-model="states.ro.phone" tag="rb"
                   @blur="onChangePhone()" @keyup.enter="onChangePhone()"
                   class="pa-1 input-box text-xs-center">
          </v-subheader>
          <v-subheader class="body-2 w-35 pr-0"><span class="mr-2">기간 :</span>
            <input v-model="states.ro.s_date" id="s_date" tag="rb" @change="onChangeDate"
                   type="month" class="pa-1 input-box mw-40">&nbsp;~&nbsp;
            <input v-model="states.ro.e_date" id="e_date" tag="rb" @change="onChangeDate"
                   type="month" class="pa-1 input-box mw-40">
          </v-subheader>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row pt-2>
      <table class="table-line w-100 elevation-5">
        <tr>
          <th class="w-20"></th>
          <th colspan="4" class="w-40">그룹 공부 현황</th>
          <th colspan="4" class="w-40">연수 현황</th>
        </tr>
        <tr>
          <td rowspan="2">주제</td>
          <td colspan="2" v-for="n in 4" :key="n">{{ n % 2 === 0 ? '직장인반': '낮반' }}</td>
        </tr>
        <tr>
          <td v-for="i in 8" :key="i">{{ i % 2 === 0 ? '인원' : '그룹'}}</td>
        </tr>
        <tr v-for="(item, index) in topics" :key="index">
          <td>{{item.name|subject}}</td>
          <td v-for="(t, i) in topicTags" :key="i">
            <input type="number" tag="rs" :value="states.rs[t][rsCode(index)]" class="w-100 text-xs-center upl-13"
                   @change="onChangeRs(t, index)" @keyup.enter="onChangeRs(t, index)">
          </td>
          <td v-for="(t, i) in topicTags" :key="4+i">
            <input type="number" tag="rt" :value="states.rt[t][rtCode(index)]" class="w-100 text-xs-center upl-13"
                   @change="onChangeRt(t, index)" @keyup.enter="onChangeRt(t, index)">
          </td>
        </tr>
        <tr class="top-line">
          <td>합계</td>
          <td v-for="(t, i) in topicTags" :key="i">
            <input type="number" :value="states.rs['tt'][t]" readonly
                   class="w-100 text-xs-center upl-13">
          </td>
          <td v-for="(t, i) in topicTags" :key="4+i">
            <input type="number" :value="states.rt['tt'][t]" readonly
                   class="w-100 text-xs-center upl-13">
          </td>
        </tr>
      </table>
    </v-layout>

    <v-layout row mt-4>
      <table class="table-line w-100 elevation-5">
        <tr>
          <th colspan="2" class="w-20">성서 40주간</th>
          <th colspan="2" class="w-20">월모임</th>
          <th colspan="2" class="w-20">교육 현황(특강,재교육)</th>
          <th colspan="6" class="w-40">봉사자 현황</th>
        </tr>
        <tr>
          <td class="w-10">낮 반</td>
          <td class="w-10">저녁 반</td>
          <td>본당</td>
          <td>본부</td>
          <td>본당</td>
          <td>본부</td>
          <td colspan="2" class="w-13">활동</td>
          <td colspan="2" class="w-13">쉼</td>
          <td colspan="2" class="w-13">예비</td>
        </tr>
        <tr>
          <td><input type="number" tag="ro" v-model="states.ro['b_40_d']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['b_40_n']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['m_sa_c']" class="text-xs-right w-80">회</td>
          <td><input type="number" tag="ro" v-model="states.ro['m_sa_n']" class="text-xs-right w-80">회</td>
          <td><input type="number" tag="ro" v-model="states.ro['m_hd_c']" class="text-xs-right w-80">회</td>
          <td><input type="number" tag="ro" v-model="states.ro['m_hd_n']" class="text-xs-right w-80">회</td>
          <td v-for="k in 6" :key="k" class="text-xs-center">{{ k % 2 === 1 ? '여' : '남' }}</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td><input type="number" tag="ro" v-model="states.ro['e_sa_c']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['e_sa_n']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['e_hd_c']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['e_hd_n']" class="text-xs-right w-80">명</td>
          <td><input type="number" tag="ro" v-model="states.ro['v_act_f']" class="text-xs-right w-80"></td>
          <td><input type="number" tag="ro" v-model="states.ro['v_act_m']" class="text-xs-right w-80"></td>
          <td><input type="number" tag="ro" v-model="states.ro['v_brk_f']" class="text-xs-right w-80"></td>
          <td><input type="number" tag="ro" v-model="states.ro['v_brk_m']" class="text-xs-right w-80"></td>
          <td><input type="number" tag="ro" v-model="states.ro['v_rsv_f']" class="text-xs-right w-80"></td>
          <td><input type="number" tag="ro" v-model="states.ro['v_rsv_m']" class="text-xs-right w-80"></td>
        </tr>
      </table>
    </v-layout>

    <v-layout pt-3>
      <v-flex xs12>
        <v-layout justify-end>
          <v-btn color="orange accent-2" outline @click="$router.back()">취소</v-btn>
          <v-btn color="indigo accent-2" outline :disabled="!isChanged" @click="updateState">현황 {{r_id ? '수정' : '저장'}}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuButtons from './control/MenuButtons'
import { FETCH_REPORT_STATE, CREATE_REPORT, UPDATE_REPORT } from '@/store/actions.type'
import { reduce } from 'lodash/collection'
import { pick, omit } from 'lodash/object'
// import { isEqual, cloneDeep } from 'lodash/lang'

export default {
  name: 'ReportStates',
  components: { MenuButtons },
  props: { r_id: undefined },
  computed: {
    ...mapGetters([
      'trnCodes',
      'stdCodes',
      'reportInfo'
    ]),
    topics () {
      return this.trnCodes.length > this.stdCodes ? this.trnCodes : this.stdCodes
    },
    topicTags () {
      return ['dg', 'dp', 'ng', 'np']
    },
    isChanged () {
      return this.changed.ro || this.changed.rb || this.changed.rt || this.changed.rs
    }
  },
  watch: {
    'states.rs.dg': {
      handler: function () {
        this.states.rs.tt.dg = this.sumData(this.states.rs.dg)
      },
      deep: true
    },
    'states.rs.dp': {
      handler: function () {
        this.states.rs.tt.dp = this.sumData(this.states.rs.dp)
      },
      deep: true
    },
    'states.rs.ng': {
      handler: function () {
        this.states.rs.tt.ng = this.sumData(this.states.rs.ng)
      },
      deep: true
    },
    'states.rs.np': {
      handler: function () {
        this.states.rs.tt.np = this.sumData(this.states.rs.np)
      },
      deep: true
    },
    'states.rt.dg': {
      handler: function () {
        this.states.rt.tt.dg = this.sumData(this.states.rt.dg)
      },
      deep: true
    },
    'states.rt.dp': {
      handler: function () {
        this.states.rt.tt.dp = this.sumData(this.states.rt.dp)
      },
      deep: true
    },
    'states.rt.ng': {
      handler: function () {
        this.states.rt.tt.ng = this.sumData(this.states.rt.ng)
      },
      deep: true
    },
    'states.rt.np': {
      handler: function () {
        this.states.rt.tt.np = this.sumData(this.states.rt.np)
      },
      deep: true
    }
  },
  created () {
    if (this.r_id) this.fetch()
    else {
      const res = this.$parent.getSmall()
      if (res) {
        this.states.ro.s_name = res.s_name
        this.states.ro.s_code = res.s_code
      }
    }
  },
  mounted () {
    const ts = document.getElementsByTagName('INPUT')
    for (let i = 0; i < ts.length; i++) {
      ts[i].addEventListener('change', () => {
        const nm = ts[i].getAttribute('tag')
        if (nm) this.changed[nm] = true
      })
    }
  },
  data: () => ({
    states: {
      rs: {dg: {}, dp: {}, ng: {}, np: {}, tt: {dg: 0, dp: 0, ng: 0, np: 0}},
      rt: {dg: {}, dp: {}, ng: {}, np: {}, tt: {dg: 0, dp: 0, ng: 0, np: 0}},
      ro: {}
    },
    fetched: false,
    changed: {rb: false, rs: false, rt: false, ro: false}
  }),
  methods: {
    async fetch () {
      await this.$store.dispatch(FETCH_REPORT_STATE, this.r_id)
      this.$nextTick(() => {
        this.states = this.reportInfo
        this._initData()
        this.fetched = true
        // console.log('fetched...', this.states)
      })
    },
    _initData () {
      this.states.rs.tt = {dg: null, dp: null, ng: null, np: null}
      this.states.rt.tt = {dg: null, dp: null, ng: null, np: null}
      this.onChangePhone(this.states.ro.phone)
      if (this.states.ro.s_date) this.states.ro.s_date = this.states.ro.s_date.slice(0, 7)
      if (this.states.ro.e_date) this.states.ro.e_date = this.states.ro.e_date.slice(0, 7)
    },
    rsCode (index) {
      return `${this.stdCodes[index].code}`
    },
    rtCode (index) {
      return `${this.trnCodes[index].code}`
    },
    onChangeRs (topic, index) {
      this.states.rs[topic][this.rsCode(index)] = event.currentTarget.value
    },
    onChangeRt (topic, index) {
      this.states.rt[topic][this.rtCode(index)] = event.currentTarget.value
    },
    onChangePhone (phone) {
      let no = phone !== undefined ? phone : event.currentTarget.value
      if (!no) return
      no = no.replace(/-/g, '')
      if (no.length > 11) no = no.slice(0, 11)

      const pn1 = no.toString().slice(0, 3)
      const pn2 = no.toString().slice(3, 7)
      const pn3 = no.toString().slice(7)
      this.states.ro.phone = `${pn1}-${pn2}-${pn3}`
    },
    onChangeDate () {
      let value = event.currentTarget.value
      if (!value || value.length < 8) return
      this.states.ro[event.currentTarget.id] = value.slice(0, 7)
      // console.log(event.currentTarget.id, value)
    },
    updateState () {
      if (!this.states.ro.s_date || !this.states.ro.e_date) return alert('보고 기간을 설정해주세요!')
      let data = {}
      if (this.changed.rb) {
        data.rb = pick(this.states.ro, ['s_code', 'name', 'phone', 's_date', 'e_date'])
        data.rb.r_year = data.rb.e_date ? data.rb.e_date.slice(0, 4) : (new Date()).getFullYear()
        data.rb.s_date = `${data.rb.s_date}-01`
        data.rb.e_date = `${data.rb.e_date}-01`
        data.rb.code = `${data.rb.s_code}-${data.rb.r_year}`
      }
      if (this.changed.ro) {
        data.ro = omit(this.states.ro, ['s_code', 'name', 'phone', 's_date', 'e_date', 's_name'])
      }
      if (this.changed.rs) data.rs = this._mapData(this.states.rs)
      if (this.changed.rt) data.rt = this._mapData(this.states.rt)

      if (this.r_id) { // update
        this.$store.dispatch(UPDATE_REPORT, {id: this.states.ro.id, obj: JSON.stringify(data)})
      } else { // create
        if (data.rb === undefined) return alert('현황 정보를 입력해주세요!')
        this.$store.dispatch(CREATE_REPORT, JSON.stringify(data))
      }
      this.changed.rb = this.changed.ro = this.changed.rt = this.changed.rt = false
      this.$showSnackBar(`${(this.r_id ? '수정' : '저장')}되었습니다.`)
    },
    _mapData (src) {
      let res = {}
      const tags = [].concat(this.topicTags, ['tt'])
      tags.forEach(t => {
        const st = src[t]
        Object.keys(st).forEach(k => {
          let obj = {}
          obj[`${t}_${k}`] = st[k]
          Object.assign(res, obj)
        })
      })
      console.log(res)
      return res
    },
    sumData (st) {
      return reduce(st, (t, n) => {
        n = (n === null) ? 0 : parseInt(n)
        return t + n
      }, 0)
    }
  },
  filters: {
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
    }
  }
}
</script>

<style scoped>
  table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
    color: dimgrey;
  }
  th, td {
    padding: 5px;
    text-align: center;
  }
  .table-line {
    border: 2px grey solid;
  }
  .top-line {
    border-top: 2px grey solid;
  }
  .upl-13 {
    padding-left: 13%;
  }
  .w-13 {
    width: 13.3%
  }
  .w-16 {
    width: 16%;
  }
  .w-24 {
    width: 24.5%;
  }
  .w-35 {
    width: 35%;
  }
  .input-box {
    width: 76%;
  }
  td .w-100 {
    width: 100% !important;
  }
  td .w-80 {
    width: 80% !important;
  }
  input.mw-40 {
    max-width: 40% !important;
  }
</style>
