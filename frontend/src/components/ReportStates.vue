<template>
  <v-container pt-2>
    <v-layout row wrap align-end>
      <v-flex xs3>
        <v-layout row wrap pb-0>
          <v-subheader class="subheading font-weight-bold pl-3">
            {{states.ro.s_name}} 본당 ({{states.ro.r_year}})
          </v-subheader>
          <!--<v-subheader class="body-2 w-24 pr-0"><span class="mr-2">작성자 :</span>
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
          </v-subheader>-->
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-subheader class="body-2 px-0 justify-center">
          <v-flex xs3>
            <v-select label="기간선택" class="pl-4 w-90 text-xs-center body-1" single-line
                      :disabled="r_id !== undefined"
                      :items="[{nm: '상반기', vl: 'A'}, {nm: '하반기', vl: 'B'}]"
                      item-text="nm" item-value="vl" v-model="states.ro.r_half"></v-select>
          </v-flex>
          <input v-model="states.ro.s_date" id="s_date" tag="rb" readonly
                 type="text" class="pa-1 input-box mw-25">&nbsp;~&nbsp;
          <input v-model="states.ro.e_date" id="e_date" tag="rb" readonly
                 type="text" class="pa-1 input-box mw-25">
        </v-subheader>
      </v-flex>
      <v-flex>
        <v-layout justify-end>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-btn slot="activator" color="indigo accent-2" outline class="mb-2"
                   :disabled="!r_id" @click="dialog = true">연도 전체 보기</v-btn>
            <v-card>
              <v-toolbar dark color="blue lighten-1">
                <v-btn icon dark @click.native="dialog = false"><v-icon>close</v-icon></v-btn>
                <v-toolbar-title>{{states.ro.s_name}} 본당 {{states.ro.r_year}}년도 현황 보기</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items><v-btn dark flat @click.native="dialog = false">닫기</v-btn></v-toolbar-items>
              </v-toolbar>
              <report-layout :code="states.ro.s_code" :year="states.ro.r_year" v-if="dialog"/>
            </v-card>
          </v-dialog>
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
                   @change="onChangeRS(t, index)" @keyup.enter="onChangeRS(t, index)">
          </td>
          <td v-for="(t, i) in topicTags" :key="4+i">
            <input type="number" tag="rt" :value="states.rt[t][rtCode(index)]" class="w-100 text-xs-center upl-13"
                   @change="onChangeRT(t, index)" @keyup.enter="onChangeRT(t, index)">
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
          <th colspan="2" class="w-20">교육 현황 (특강,재교육)</th>
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
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_act_f']" class="pr-1 text-xs-right w-80"></td>
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_act_m']" class="pr-1 text-xs-right w-80"></td>
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_brk_f']" class="pr-1 text-xs-right w-80"></td>
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_brk_m']" class="pr-1 text-xs-right w-80 "></td>
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_rsv_f']" class="pr-1 text-xs-right w-80"></td>
          <td class="px-0"><input type="number" tag="ro" v-model="states.ro['v_rsv_m']" class="pr-1 text-xs-right w-80"></td>
        </tr>
      </table>
    </v-layout>

    <v-layout pt-3>
      <v-flex xs6>
        <v-layout justify-start>
          <v-subheader class="subheading w-80">
            <span class="mr-0 w-20">작성자 :</span>
            <input v-model="states.ro.name" tag="rb"
                   placeholder="예) 김대건 안드레아" class="pa-1 input-box body-1 text-xs-center">
          </v-subheader>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <v-btn color="orange accent-2" outline @click="$router.back()">취소</v-btn>
          <v-btn color="indigo accent-2" outline :disabled="!isEnabled" @click="submit">현황 {{r_id ? '수정' : '저장'}}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_REPORT_STATE, CREATE_REPORT, UPDATE_REPORT } from '@/store/actions.type'
import { reduce } from 'lodash/collection'
import { pick, omit } from 'lodash/object'
import MenuButtons from './control/MenuButtons'
import ReportLayout from './ReportLayout'

export default {
  name: 'ReportStates',
  components: { MenuButtons, ReportLayout },
  props: { r_id: undefined },
  computed: {
    ...mapGetters([
      'trnCodes',
      'stdCodes',
      'reportInfo',
      'smallLeader'
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
    'states.ro.r_half' (val) {
      if (this.r_id || !val) return
      const thisYear = (new Date()).getFullYear()
      if (val === 'A') { // 2017-09-01 ~ 2018-02-28
        this.states.ro.s_date = `${thisYear - 1}-09`
        this.states.ro.e_date = `${thisYear}-02`
      } else if (val === 'B') { // 2018-03-01 ~ 2018-08-31
        this.states.ro.s_date = `${thisYear}-03`
        this.states.ro.e_date = `${thisYear}-08`
      }
      this.changed.rb = true
    },
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
        this.states.ro.r_year = (new Date()).getFullYear()
      }
    }
  },
  mounted () {
    this.initStates()
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
      ro: {r_half: null}
    },
    fetched: false,
    dialog: false,
    isEnabled: true,
    changed: {rb: false, rs: false, rt: false, ro: false}
  }),
  methods: {
    async fetch () {
      await this.$store.dispatch(FETCH_REPORT_STATE, this.r_id)
      this.$nextTick(() => {
        this.states = this.reportInfo
        this.states.rs.tt = {dg: 0, dp: 0, ng: 0, np: 0}
        this.states.rt.tt = {dg: 0, dp: 0, ng: 0, np: 0}
        const [sDate, eDate] = [this.states.ro.s_date, this.states.ro.e_date]
        if (sDate) {
          this.$parent.S_DATE = sDate
          this.states.ro.s_date = sDate.slice(0, 7)
        }
        if (eDate) {
          this.$parent.E_DATE = eDate
          this.states.ro.e_date = eDate.slice(0, 7)
        }
        this.$parent.S_CODE = this.states.ro.s_code
        this.$parent.S_NAME = this.states.ro.s_name
        if (!this.$parent.isAccessible()) {
          console.log('access failed')
          this.isEnabled = false
        }
        this.fetched = true
      })
    },
    rsCode (index) {
      return `${this.stdCodes[index].code}`
    },
    rtCode (index) {
      return `${this.trnCodes[index].code}`
    },
    onChangeRS (topic, index) {
      if (!this.isEnabled) return alert('수정 권한이 없습니다!')
      if (!this.states.ro.r_half) return alert('보고 기간부터 확인해주세요!')
      const rsv = event.currentTarget.value
      this.states.rs[topic][this.rsCode(index)] = rsv === '' ? 0 : rsv
      this.states.rs.tt[topic] = this.sumData(this.states.rs[topic])
    },
    onChangeRT (topic, index) {
      if (!this.isEnabled) return alert('수정 권한이 없습니다!')
      if (!this.states.ro.r_half) return alert('보고 기간부터 확인해주세요!')
      const rtv = event.currentTarget.value
      this.states.rt[topic][this.rtCode(index)] = rtv === '' ? 0 : rtv
      this.states.rt.tt[topic] = this.sumData(this.states.rt[topic])
    },
    submit () {
      if (!this.states.ro.s_date || !this.states.ro.e_date) return alert('보고 기간을 확인해주세요!')
      let data = {}
      if (this.changed.rb) {
        data.rb = pick(this.states.ro, ['s_code', 'r_half', 'name', 'r_year', 's_date', 'e_date', 'numbers'])
        data.rb.s_date = `${data.rb.s_date}-01`
        data.rb.e_date = `${data.rb.e_date}-${data.rb.r_half === 'A' ? '28' : '31'}`
        data.rb.r_code = `${data.rb.s_code}-${data.rb.r_year}-${data.rb.r_half}`
        data.rb.lv_id = this.smallLeader.lv_id
      }
      if (this.changed.ro) data.ro = omit(this.states.ro, ['s_code', 's_date', 'e_date'])
      if (this.changed.rs) data.rs = this.mapData(this.states.rs)
      if (this.changed.rt) data.rt = this.mapData(this.states.rt)

      if (this.r_id) { // update
        this.$store.dispatch(UPDATE_REPORT, {id: this.r_id, obj: JSON.stringify(data)})
      } else { // create
        if (data.rb === undefined) return alert('현황 정보를 입력해주세요!')
        this.createState(data)
      }
      this.changed.rb = this.changed.ro = this.changed.rt = this.changed.rs = false
      this.$showSnackBar(`${(this.r_id ? '수정' : '저장')}되었습니다.`)
    },
    async createState (data) {
      let rid = null
      try {
        rid = await this.$store.dispatch(CREATE_REPORT, {r: data, s: JSON.stringify(data)})
      } catch (e) {
        return alert('실패하였습니다.' + e)
      }

      this.$nextTick(() => {
        // console.log('createState', rid)
        this.$parent.RID = rid
      })
    },
    mapData (src) {
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
      return res
    },
    sumData (st) {
      return reduce(st, (t, n) => {
        n = (n === null) ? 0 : parseInt(n)
        return t + n
      }, 0)
    },
    initStates () {
      Object.keys(this.states).forEach(so => {
        if (so === 'ro') return
        const temp = so === 'rs' ? this.stdCodes : this.trnCodes
        const codes = temp.map(o => o.code)
        this.topicTags.forEach(o => {
          this.states[so][o] = {}
          codes.forEach(c => {
            this.states[so][o][c] = null
          })
        })
      })
    }
    /* onChangePhone (phone) {
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
    } */
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
    width: 60%;
  }
  td .w-100 {
    width: 100% !important;
  }
  td .w-80 {
    width: 80% !important;
  }
  input.mw-25 {
    max-width: 18% !important;
  }
</style>
