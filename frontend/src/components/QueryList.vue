<template>
  <div class="mb-4">
    <v-form ref="form" v-if="isQueryBox">
      <transition name="slide-fade">
        <v-container class="elevation-4 py-1 w-85">
          <v-layout row wrap pl-2>
            <v-flex xs12 sm3>
              <v-select label="교구" v-model="model.la_code" hide-details class="body-1"
                        :items="lAreaCodes" item-text="l_name" item-value="l_code"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3>
              <v-select label="교구 > 지구" v-model="model.ma_code" hide-details class="body-1" no-data-text="지구 자료가 없습니다."
                        :items="mAreaCodes" item-text="m_name" item-value="m_code"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-combobox label="교구 > 지구 > 본당" v-model="model.sa_name" hide-details
                          :items="model.items" item-value="code" item-text="name"
                          :search-input.sync="model.search" @input="onBlur" clearable>
              </v-combobox>
            </v-flex>
          </v-layout>
          <v-layout row wrap pl-2>
            <v-flex xs3>
              <v-layout>
                <v-flex xs6>
                <v-select label="선서연도 시작" v-model="params.au_s_date" hide-details
                          :items="years" class="body-1"
                ></v-select>
                </v-flex>
                <v-flex xs6 ml-2>
                  <v-select label="선서연도 끝" v-model="params.au_e_date" hide-details
                            :items="years" class="body-1"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="봉사자 이름" v-model="params.v_name" hide-details></v-text-field>
            </v-flex>
            <v-flex xs3>
              <!--<v-combobox label="본당 이름" v-model="small.model" hide-details
                          :items="small.items" item-value="code" item-text="name"
                          :search-input.sync="small.search" @input="onBlur" clearable>
                <template slot="no-data">
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        "<strong>{{ small.search }}</strong>" 본당이 없습니다. 관리자에게 문의해주세요.
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-combobox>-->
              <v-text-field label="본당 이름" v-model="params.s_name" hide-details></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="메모 내용" v-model="params.memo" hide-details></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row pl-2 mb-1>
            <v-flex xs3>
              <v-layout>
                <v-flex xs6>
                  <v-select label="조회 연령대" v-model="params.s_age" hide-details :items="ages" class="body-1"
                  ></v-select>
                </v-flex>
                <v-flex xs6 pl-2>
                  <v-select label="조회 연도" v-model="params.s_year" hide-details :items="birthYears" class="body-1"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs9 mt-2 text-xs-right>
              <v-btn color="green" outline @click="toExcel">내려받기</v-btn>
              <v-btn color="orange accent-2" outline @click="reset">초기화</v-btn>
              <v-btn color="indigo accent-2" outline @click="submit">조회</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </transition>
    </v-form>
    <v-container class="elevation-2 w-85" :class="[isQueryBox ? 'mt-3' : 'mt-0']">
      <v-tooltip bottom>
        <v-btn fixed outline fab right @click="isQueryBox = !isQueryBox"
               slot="activator" :class="[isQueryBox ? 't-35p' : 't-18p']" color="cyan">
          <v-icon>{{isQueryBox ? 'arrow_upward' : 'arrow_downward'}}</v-icon>
        </v-btn>
        <span>{{isQueryBox ? '박스 숨기기' : '박스 펼치기'}}</span>
      </v-tooltip>
      <v-layout pb-2>
        <v-flex xs6 text-xs-left>
          <div>조회 결과 수 : {{queryCount|units}} 건</div>
        </v-flex>
        <v-flex xs6 text-xs-right>
          <div>월교육 : {{edusCount|units}} 건 / 봉사 {{actsCount|units}} 건</div>
        </v-flex>
      </v-layout>
      <v-data-table :headers="headers" :items="queryVolunteers"
                    :loading="queried && isQuerying" :disable-initial-sort="true"
                    :rows-per-page-items="perPage" :pagination.sync="pagination"
                    rows-per-page-text="페이지 당 보기 개수" no-data-text="조회 조건을 선택하세요.">
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr @click="selected = props.item" @dblclick="onClickResult(props.item)"
              :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
            <td class="text-xs-center w-4">{{ props.index + 1 }}</td>
            <td class="text-xs-center w-10">{{ props.item.ca_id|dash }}</td>
            <td class="text-xs-center w-10" style="cursor: pointer">{{ props.item.name }}</td>
            <td class="text-xs-center w-13" style="cursor: pointer">{{ props.item.ca_name }}</td>
            <td class="text-xs-center w-10">{{ props.item.au_date|datestamp }}</td>
            <td class="text-xs-center w-10">{{ props.item.br_date|datestamp }}</td>
            <td class="text-xs-center w-11">{{ props.item.la_name }}</td>
            <td class="text-xs-center w-13">{{ props.item.sa_name }}</td>
            <td class="text-xs-center w-8">{{ activityState[props.item.state] }}</td>
            <td class="text-xs-center w-4">{{ props.item.edu_count }}</td>
            <!--<td class="text-xs-center w-5">{{ props.item.grp_count }}</td>-->
            <td class="text-xs-center w-4">{{ props.item.act_count }}</td>
            <td class="text-xs-center w-15 memo-link" :class="props.item.memo ? 'memo-over' : ''"
                @click.stop.prevent="onClickMemo(props.item)">{{ props.item.memo }}</td>
          </tr>
        </template>
        <template slot="pageText" slot-scope="{pageStart, pageStop, itemsLength}">
          전체 {{itemsLength}}개 중 {{ pageStart }} ~ {{ pageStop }}
        </template>
        <template slot="no-data" v-if="queried">
          <div class="text-xs-center">결과 내역이 없습니다.</div>
        </template>
      </v-data-table>
    </v-container>
    <people-dialog :visible="peopleFinder" @close-find-people="onPeopleFound"/>
    <church-dialog :visible="churchFinder" @close-find-church="onChurchFound"/>
  </div>
</template>

<script>
import DatePicker from '@/components/control/DatePicker'
import PeopleDialog from '@/components/control/FindPeopleDialog'
import ChurchDialog from '@/components/control/FindChurchDialog'
import { QUERY_VOLUNTEERS } from '@/store/actions.type'
import { SET_QUERY_INFO } from '@/store/mutations.type'
import { mapGetters } from 'vuex'
import XLSX from 'xlsx'
import { range } from 'lodash/util'
import { uniqBy, concat } from 'lodash/array'
import { filter, map, find, orderBy, reduce } from 'lodash/collection'
import { startsWith } from 'lodash/string'

export default {
  name: 'QueryList',
  components: { DatePicker, PeopleDialog, ChurchDialog },
  computed: {
    ...mapGetters([
      'smallCodes',
      'areaCodes',
      'isQuerying',
      'queryInfo',
      'queryCount',
      'queryVolunteers'
    ]),
    lAreaCodes () {
      let init = [{l_name: '선택없음', l_code: ''}]
      return concat(init, uniqBy(this.areaCodes, 'l_code'))
    },
    mAreaCodes () {
      let init = [{m_name: '선택없음', m_code: ''}]
      let rest = filter(uniqBy(this.areaCodes, 'm_code'), (o) => startsWith(o.a_code, `${this.model.la_code}-`))
      return concat(init, rest)
    },
    sAreaCodes () {
      let init = [{s_name: '선택없음', s_code: ''}]
      let rest = filter(uniqBy(this.areaCodes, 's_code'), (o) => startsWith(o.a_code, `${this.model.ma_code}`))
      return concat(init, rest)
    },
    formData () { return this.$data.params },
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 1920, -1))
    },
    birthYears () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start - 30, 1920, -1))
    },
    ages () {
      return ['선택없음', 30, 40, 50, 60, 70, 80]
    },
    actsCount () {
      return reduce(this.queryVolunteers, (t, v) => t + v.act_count, 0)
    },
    edusCount () {
      return reduce(this.queryVolunteers, (t, v) => t + v.edu_count, 0)
    },
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망' }
    }
  },
  watch: {
    'model.la_code' (code) {
      if (!code) {
        this.params.a_code = this.model.sa_code ? this.model.sa_code : this.model.ma_code
        return
      }
      this.params.a_code = code
      this.model.sa_name = this.model.search = ''
      // console.log('la_code', code)
    },
    'model.ma_code' (code, old) {
      if (!code) {
        this.params.a_code = this.model.sa_code ? this.model.sa_code : this.model.la_code
        return
      }
      this.params.a_code = code
      this.model.sa_name = ''
      if (old) {
        const res = find(this.mAreaCodes, (o) => o.m_code === code)
        res && (this.model.search = res.m_name)
      }
      // console.log('ma_code', code)
    },
    'model.sa_code' (code) {
      if (!code) { // 인위적인 초기화
        this.params.a_code = this.model.ma_code ? this.model.ma_code : this.model.la_code
        return
      }
      this.params.a_code = code
      // console.log('sa_code', code)
    },
    'params.au_s_date' (val) {
      if (val === '선택없음') this.params.au_s_date = ''
    }
    /* 'params.s_age'(val) {
      if (val === '선택없음') this.params.s_age = ''
      else if (val && this.params.e_age) {
        if (val >= this.params.e_age) {
          alert('끝 연령이 시작 연령보다 커야합니다.')
          this.params.s_age = ''
        }
      }
    }, */
  },
  async created () {
    this.headers.map(h => {
      h.class = ['text-xs-center', 'body-2', 'pl-20x',
        h.value.indexOf('_cnt') > 0 ? 'w-5' : 'w-10']
    })
    if (!this.areaCodes.length) await this.$store.dispatch('fetchAreaCodes')
    const list = map(this.smallCodes(null), o => {
      const path = `${o.s_name} - ${o.m_name} - ${o.l_name}`
      return {code: o.s_code, name: path}
    })
    this.model.items = orderBy(list, ['name'])
  },
  mounted () {
    // this.reset()
    const list = document.getElementsByClassName('v-input')
    this.$nextTick(() => {
      for (let d of list) {
        const input = d && d.getElementsByTagName('input')[0]
        if (input) input.style.fontSize = '14px'
        const label = d && d.getElementsByTagName('label')[0]
        if (label) label.style.fontSize = '14px'
      }
    })
  },
  data: () => ({
    model: {
      items: [],
      la_code: '',
      ma_code: '',
      sa_code: '',
      sa_name: '',
      search: null
    },
    isQueryBox: true,
    queried: false,
    selected: {},
    peopleFinder: false,
    churchFinder: false,
    perPage: [25, 50, 100, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
    pagination: { sortBy: 'id', rowsPerPage: -1 },
    params: {
      au_s_date: null,
      au_e_date: null,
      v_name: '',
      s_name: '',
      memo: '',
      a_code: '',
      s_age: '',
      s_year: ''
    },
    headers: [
      { text: '순번', value: 'idx_cnt' },
      { text: '고유번호', value: 'ca_id' },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '선서일', value: 'au_date' },
      { text: '생년월일', value: 'br_date' },
      { text: '교구명', value: 'la_name' },
      { text: '본당명', value: 'sa_name' },
      { text: '활동상태', value: 'state' },
      { text: '교육', value: 'edu_cnt' },
      { text: '봉사', value: 'act_cnt' },
      { text: '메모', value: 'memo' }
    ]
  }),
  methods: {
    reset () {
      // this.resetCode()
      this.params.au_s_date = this.params.au_e_date = null
      this.params.v_name = this.params.s_name = this.params.memo = this.params.s_age = this.params.e_age = ''
      this.model = { la_name: '', ma_name: '', sa_name: '', search: null }
    },
    submit () {
      // let isEmpty = true
      Object.keys(this.formData).forEach(f => {
        const obj = this.formData[f]
        // if (obj) isEmpty = false
        if (f === 'v_name') this.params.v_name = obj && obj.replace(/\s*/g, '')
        if (f === 's_age' && this.params.s_age) {
          this.params.st_age = (new Date()).getFullYear() - (this.params.s_age + 8)
          if (this.params.s_age === 30) {
            this.params.ed_age = this.params.st_age; this.params.st_age = null
          } else if (this.params.s_age === 80) {
            this.params.ed_age = null; this.params.st_age = this.params.st_age + 10
          } else {
            this.params.ed_age = this.params.st_age + 9
          }
        }
      })
      // if (isEmpty) return alert('조회할 항목을 설정하세요.')
      console.log(this.formData)
      this.$store.dispatch(QUERY_VOLUNTEERS, this.formData)
      this.queried = true
    },
    setLastInfo () {
      this.selected = this.queryInfo.good
      this.params = this.queryInfo.cond
    },
    onClickResult (item) {
      this.selected = item
      this.$store.commit(SET_QUERY_INFO, {cond: this.formData, good: item})
      setTimeout(() => {
        this.$router.push({name: 'view-query', params: {id: item.id}})
      }, 100)
    },
    onClickMemo (item) {
      if (!item.memo) return
      this.$router.push({path: `/volunteers/edit/${item.id}`})
    },
    onPeopleFound (data) {
      console.log('found people...', data)
      this.peopleFinder = false
    },
    onChurchFound (data) {
      console.log('found church...', data)
      this.churchFinder = false
    },
    onBlur (info) {
      if (!info || typeof info !== 'object') {
        this.$nextTick(() => {
          this.model.search = this.model.sa_name = ''
        })
        this.params.a_code = this.model.ma_code ? this.model.ma_code : this.model.la_code
        return
      }
      // console.log('blur', info)
      this.model.la_code = info.code.slice(0, 2)
      this.model.ma_code = info.code.slice(0, 5)
      this.params.a_code = this.model.sa_code = info.code
    },
    onChangedCode (type, val) {
      if (type === 'm' && !val) this.params.area_code = this.areaCode.la_code
      else if (type === 's' && !val) this.params.area_code = this.areaCode.ma_code

      this.params.a_code = this.params.area_code
      // console.log(type, val, this.params.a_code)
    },
    toExcel () {
      if (this.pagination.rowsPerPage !== -1) return alert('전체 페이지 보기로 설정해주세요!')
      const table = document.getElementsByTagName('table')
      const wb = XLSX.utils.table_to_book(table[2], {raw: true})
      XLSX.writeFile(wb, 'queried_list.xlsx')
    }
  },
  filters: {
    dash (code) {
      const a = code.substring(0, 2)
      const b = code.substring(2)
      return `${a}-${b}`
    },
    units (x) {
      if (!Number.isInteger(x) || Number.isNaN(x)) return x
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped>
  .t-35p {
    top: 35%;
  }
  .t-18p {
    top: 18%;
  }
  tr td { padding: 0 !important;}
  .w-4 {
    width: 4% !important;
  }
  .w-8 {
    width: 8% !important;
  }
  .w-11 {
    width: 11% !important;
  }
  .w-13 {
    width: 13% !important;
  }
  .w-15 {
    width: 15% !important;
  }
  .pl-20x { padding-left: 35px !important; }
  .memo-link {
    overflow-x: hidden;
    white-space: nowrap;
    max-width: 150px;
    text-overflow: ellipsis;
  }
  .memo-over {
    cursor: pointer
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
