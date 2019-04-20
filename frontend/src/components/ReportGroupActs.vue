<template>
  <v-container pt-2>
    <v-layout row wrap align-end v-if="fetched && Object.keys(states.ro).length">
      <v-flex xs3>
        <v-layout row wrap pb-0>
          <v-subheader class="subheading font-weight-bold pl-3">
            {{states.ro.s_name}} 본당 ({{states.ro.r_year}})
          </v-subheader>
        </v-layout>
      </v-flex>
      <v-flex xs9 text-xs-right>
        <v-subheader class="body-2 px-0 justify-end">
          <input v-model="states.ro.s_date" id="s_date" tag="rb" readonly
                 type="text" class="pa-1 input-box mw-25">&nbsp;~&nbsp;
          <input v-model="states.ro.e_date" id="e_date" tag="rb" readonly
                 type="text" class="pa-1 input-box mw-25">
        </v-subheader>
      </v-flex>
    </v-layout>

    <v-layout row pt-2>
      <table class="table-line w-100 elevation-5" v-if="fetched && Object.keys(states.ra).length">
        <tr>
          <th class="w-20" rowspan="3">봉사 항목</th>
          <th colspan="4" class="w-40">그룹 봉사 현황</th>
        </tr>
        <tr>
          <td colspan="2" v-for="n in 2" :key="n">{{ n % 2 === 0 ? '직장인반': '낮반' }}</td>
        </tr>
        <tr>
          <td v-for="i in 4" :key="i">{{ i % 2 === 0 ? '인원' : '그룹'}}</td>
        </tr>
        <tr v-for="(item, index) in actCodes" :key="index">
          <td>{{item.name|subject}}</td>
          <td v-for="(t, i) in topicTags" :key="i">
            <div class="text-xs-center" v-if="states.ra[raCode(index)]">{{states.ra[raCode(index)][t]}}</div>
          </td>
        </tr>
        <tr class="top-line">
          <td>합계</td>
          <td v-for="(t, i) in topicTags" :key="i">
            <div class="text-xs-center subheading"><b>{{states.ra['tt'][t]}}</b></div>
          </td>
        </tr>
      </table>
    </v-layout>

    <v-layout pt-3>
      <v-flex xs6>
        <v-layout justify-start>
          <!--<v-subheader class="subheading w-80">
            <span class="mr-0 w-20">작성자 :</span>
            <input v-model="states.ro.name" tag="rb"
                   placeholder="예) 김대건 안드레아" class="pa-1 input-box body-1 text-xs-center">
          </v-subheader>-->
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end>
          <v-btn color="orange accent-2" outline @click="$router.back()">취소</v-btn>
          <v-btn color="indigo accent-2" outline :disabled="!!r_id" @click="submit">생성</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_REPORT_GROUP_ACTS, FETCH_REPORT_STATE, CREATE_REPORT } from '@/store/actions.type'
import { reduce, find, groupBy } from 'lodash/collection'
import { pick } from 'lodash/object'
import MenuButtons from './control/MenuButtons'

export default {
  name: 'ReportGroupActs',
  components: { MenuButtons },
  props: { r_id: undefined },
  computed: {
    ...mapGetters([
      'actCodes',
      'reportInfo',
      'reportGroupActs',
      'reports',
      'smallLeader'
    ]),
    topicTags () {
      return ['dg', 'dp', 'ng', 'np']
    }
  },
  created () {
    if (this.r_id) {
      this.fetch()
    } else {
      const {sName, sCode, rYear, rHalf} = this.$parent.getReportInfo()
      this.states.ro.s_name = sName
      this.states.ro.s_code = sCode
      this.arrangeDate(rYear, rHalf)

      const rcd = `${sCode}-${this.states.ro.r_year}`
      const one = find(this.reports, o => o.r_code === rcd)
      if (one) {
        alert('이미 보고된 리포트가 존재합니다! 해당 리포트로 이동합니다.')
        this.fetch(this.$parent.RID = one.id)
      }
    }
  },
  data: () => ({
    states: {
      ra: {},
      ro: {r_half: 'A'}
    },
    fetched: false,
    changed: false
  }),
  methods: {
    async fetch (rid = null) {
      await this.$store.dispatch(FETCH_REPORT_STATE, !rid ? this.r_id : rid)
      this.states = this.reportInfo

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

      const payload = {
        a_code: this.states.ro.s_code,
        s_date: this.states.ro.s_date,
        e_date: this.states.ro.e_date
      }
      await this.$store.dispatch(FETCH_REPORT_GROUP_ACTS, payload)
      const src = groupBy(this.reportGroupActs, 'act_code')
      this.states.ra = Object.assign({}, this.mapData(src))

      // console.log(this.states)
      this.fetched = true
    },
    raCode (index) {
      return `${this.actCodes[index].code}`
    },
    submit () {
      let data = {}
      data.rb = pick(this.states.ro, ['s_code', 'r_year', 's_date', 'e_date'])
      data.rb.s_date = `${data.rb.s_date}-01`
      data.rb.e_date = `${data.rb.e_date}-31`
      data.rb.r_code = `${data.rb.s_code}-${data.rb.r_year}`
      this.createState(data)
    },
    async createState (data) {
      let rid = null
      try {
        rid = await this.$store.dispatch(CREATE_REPORT, {r: data, s: JSON.stringify(data)})
        this.$showSnackBar(`생성되었습니다.`)
      } catch (e) {
        return alert('실패하였습니다.' + e)
      }

      this.$nextTick(() => {
        this.$parent.RID = rid
        this.fetch(rid)
      })
    },
    mapData (src) {
      const tt = {dg: 0, dp: 0, ng: 0, np: 0}
      Object.keys(src).forEach(f => {
        const obj = {}
        for (let r of src[f]) {
          if (r.group_type === 'N') {
            obj['ng'] = r.g_count
            obj['np'] = r.p_count
          } else {
            obj['dg'] = r.g_count
            obj['dp'] = r.p_count
          }
        }
        for (let t of this.topicTags) {
          if (obj[t]) tt[t] += obj[t]
        }
        src[f] = Object.assign({}, obj)
      })
      src['tt'] = tt
      return src
    },
    sumData (st) {
      return reduce(st, (t, n) => {
        n = (n === null) ? 0 : parseInt(n)
        return t + n
      }, 0)
    },
    arrangeDate (rYear, rHalf) {
      this.states.ro.s_date = `${rYear - 1}-09`
      this.states.ro.e_date = `${rYear}-08`
      this.states.ro.r_year = rYear
      this.$parent.S_DATE = `${this.states.ro.s_date}-01`
      this.$parent.E_DATE = `${this.states.ro.e_date}-31`
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
  .half {
    width: 85px;
    float: right;
  }
</style>
