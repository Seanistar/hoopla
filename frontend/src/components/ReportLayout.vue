<template>
 <v-container>
   <v-layout row pt-2>
     <table class="table-line w-100 elevation-5">
       <tr>
         <th class="w-20"></th>
         <th colspan="4" class="w-40 py-3">그룹 공부 현황</th>
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
           <input type="number" :value="tags[`${t}_${rsCode(index)}`]" readonly
                  class="w-100 text-xs-center upl-13">
         </td>
         <td v-for="(t, i) in topicTags" :key="4+i">
           <input type="number" :value="tags[`${t}_${rtCode(index)}`]" readonly
                  class="w-100 text-xs-center upl-13">
         </td>
       </tr>
       <tr class="top-line">
         <td>합계</td>
         <td v-for="(t, i) in topicTags" :key="i">
           <input type="number" :value="tt.rs[t]" readonly
                  class="w-100 text-xs-center upl-13">
         </td>
         <td v-for="(t, i) in topicTags" :key="4+i">
           <input type="number" :value="tt.rt[t]" readonly
                  class="w-100 text-xs-center upl-13">
         </td>
       </tr>
     </table>
   </v-layout>

   <v-layout row mt-4>
     <table class="table-line w-100 elevation-5">
       <tr>
         <th colspan="2" class="w-20 py-3">성서 40주간</th>
         <th colspan="2" class="w-20">월모임</th>
         <th colspan="2" class="w-20">교육 현황 (특강, 재교육)</th>
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
         <td class="text-xs-right"><span class="pr-2">{{tags['b_40_d']}} 명</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['b_40_n']}} 명</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['m_sa_c']}} 회</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['m_sa_n']}} 회</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['m_hd_c']}} 회</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['m_hd_n']}} 회</span></td>
         <td v-for="k in 6" :key="k" class="text-xs-center"><span>{{ k % 2 === 1 ? '여' : '남' }}</span></td>
       </tr>
       <tr>
         <td colspan="2" class="w-10"></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['e_sa_c']}} 명</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['e_sa_n']}} 명</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['e_hd_c']}} 명</span></td>
         <td class="text-xs-right"><span class="pr-2">{{tags['e_hd_n']}} 명</span></td>
         <td><span>{{tags['v_act_f']}}</span></td>
         <td><span>{{tags['v_act_m']}}</span></td>
         <td><span>{{tags['v_brk_f']}}</span></td>
         <td><span>{{tags['v_brk_m']}}</span></td>
         <td><span>{{tags['v_rsv_f']}}</span></td>
         <td><span>{{tags['v_rsv_m']}}</span></td>
       </tr>
     </table>
   </v-layout>
 </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { range } from 'lodash/util'
import { zipObject } from 'lodash/array'
import { size, map, forEach } from 'lodash/collection'
import { FETCH_DYNAMIC_STATE } from '@/store/actions.type'

export default {
  name: 'StateLayout',
  props: {
    code: null,
    year: null
  },
  computed: {
    ...mapGetters([
      'trnCodes',
      'stdCodes',
      'dynamicSTAT'
    ]),
    topics () {
      return this.trnCodes.length > this.stdCodes ? this.trnCodes : this.stdCodes
    },
    topicTags () {
      return ['dg', 'dp', 'ng', 'np']
    },
    studyTags () {
      let tags = []
      this.topicTags.forEach(t => {
        this.stdCodes.forEach(s => {
          tags.push(`${t}_${s.code}`)
        })
      })
      return tags
    },
    trainTags () {
      let tags = []
      this.topicTags.forEach(t => {
        this.trnCodes.forEach(s => {
          tags.push(`${t}_${s.code}`)
        })
      })
      return tags
    },
    otherTags () {
      return [
        'b_40_d', 'b_40_n',
        'm_sa_c', 'm_sa_n', 'm_hd_c', 'm_hd_n',
        'e_sa_c', 'e_sa_n', 'e_hd_c', 'e_hd_n',
        'v_act_f', 'v_act_m', 'v_brk_f', 'v_brk_m', 'v_rsv_f', 'v_rsv_m'
      ]
    },
    allTags () {
      return Array.concat(this.otherTags, this.studyTags, this.trainTags)
    },
    studyCDs () {
      return map(this.stdCodes, c => c.code)
    },
    trainCDs () {
      return map(this.trnCodes, c => c.code)
    }
  },
  data: () => ({
    tt: {
      rs: {dg: 0, dp: 0, ng: 0, np: 0},
      rt: {dg: 0, dp: 0, ng: 0, np: 0}
    },
    tags: {}
  }),
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      await this.$store.dispatch(FETCH_DYNAMIC_STATE, {s_code: this.code, r_year: this.year})
      this.mapData()
    },
    mapData () {
      let tags = zipObject(this.allTags, range(0, size(this.allTags), 0))
      this.dynamicSTAT.forEach(d => {
        map(d, (v, k, o) => {
          if (tags[k] !== undefined) tags[k] += v
        })
      })
      this.tags = tags
      // calculate sum of each value
      forEach(tags, (v, k) => {
        let [tp, cd] = k.split('_')
        if (!this.topicTags.some(o => o === tp)) return
        cd = parseInt(cd)
        if (this.studyCDs.some(s => s === cd)) {
          this.tt.rs[tp] += v
        } else if (this.trainCDs.some(t => t === cd)) {
          this.tt.rt[tp] += v
        }
      })
    },
    rsCode (index) {
      return `${this.stdCodes[index].code}`
    },
    rtCode (index) {
      return `${this.trnCodes[index].code}`
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
  td .w-100 {
    width: 100% !important;
  }
</style>
