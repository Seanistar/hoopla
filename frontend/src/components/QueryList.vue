<template>
  <div class="mb-4">
    <v-form ref="form" v-if="isQueryBox">
      <transition name="slide-fade">
        <v-container class="elevation-4 py-1 w-85">
          <v-layout row wrap pl-2>
            <v-flex xs12 sm3>
              <v-select label="교구" v-model="areaCode.la_code" hide-details class="body-1"
                        :items="lAreaCodes" item-text="l_name" item-value="l_code"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3>
              <v-select label="교구 > 지구" v-model="areaCode.ma_code" hide-details class="body-1" no-data-text="지구 자료가 없습니다."
                        :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm3>
              <v-select label="교구 > 지구 > 본당" v-model="areaCode.sa_code" hide-details class="body-1" no-data-text="본당 자료가 없습니다."
                        :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
              ></v-select>
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
          <v-layout justify-end row class="my-1">
            <v-btn color="orange accent-2" outline @click="reset">초기화</v-btn>
            <v-btn color="indigo accent-2" outline @click="submit">조회</v-btn>
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
        <v-flex xs12>
          <div>조회 결과 수 : {{queryCount}} 건</div>
        </v-flex>
      </v-layout>
      <v-data-table :headers="headers" :items="queryVolunteers" :loading="queried && isQuerying"
                    :pagination.sync="pagination" :rows-per-page-items="perPage"
                    rows-per-page-text="페이지 당 보기 개수" no-data-text="조회 조건을 선택하세요."
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr @click="selected = props.item" @dblclick="onClickResult(props.item)"
              :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
            <td class="text-xs-center w-10">{{ props.item.id }}</td>
            <td class="text-xs-center w-10">{{ props.item.name }}</td>
            <td class="text-xs-center w-15">{{ props.item.ca_name }}</td>
            <td class="text-xs-center w-10">{{ props.item.au_date|yearstamp }}</td>
            <td class="text-xs-center w-15">{{ props.item.la_name }}</td>
            <td class="text-xs-center w-15">{{ props.item.sa_name }}</td>
            <td class="text-xs-center w-5">{{ props.item.edu_count }}</td>
            <!--<td class="text-xs-center w-5">{{ props.item.grp_count }}</td>-->
            <td class="text-xs-center w-5">{{ props.item.act_count }}</td>
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
import CodeMixin from '@/common/code.mixin'
import PeopleDialog from '@/components/control/FindPeopleDialog'
import ChurchDialog from '@/components/control/FindChurchDialog'
import { QUERY_VOLUNTEERS } from '@/store/actions.type'
import { SET_QUERY_INFO } from '@/store/mutations.type'
import { mapGetters } from 'vuex'
import { range } from 'lodash/util'
import { map, orderBy } from 'lodash/collection'

export default {
  name: 'QueryList',
  mixins: [ CodeMixin ],
  components: { DatePicker, PeopleDialog, ChurchDialog },
  computed: {
    ...mapGetters([
      'smallCodes',
      'isQuerying',
      'queryInfo',
      'queryCount',
      'queryVolunteers'
    ]),
    formData () { return this.$data.params },
    /* formData () {
      return {
        a_code: this.params.area_code,
        v_name: this.params.v_name,
        memo: this.params.memo,
        au_date: this.params.au_date,
        sa_code: this.small.model ? this.small.model.code : ''
      }
    }, */
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 1972, -1))
    }
  },
  watch: {
    'small.model' (obj) {
      /* if (val && val.length > 5) {
        this.$nextTick(() => this.small.model.pop())
      } */
      this.params.sa_code = obj ? obj.code : ''
    },
    'params.au_s_date' (val) {
      if (val && val === '선택없음') this.params.au_s_date = ''
    }
  },
  created () {
    this.headers.map(h => {
      h.class = ['text-xs-center', 'body-2', 'pl-39x',
        h.value.indexOf('_cnt') > 0 ? 'w-5' : 'w-10']
    })
    const list = map(this.smallCodes(null), o => {
      return {code: o.s_code, name: o.s_name}
    })
    this.small.items = orderBy(list, ['name'])
  },
  mounted () {
    this.reset()
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
    small: {
      items: [],
      model: '',
      search: null
    },
    isQueryBox: true,
    queried: false,
    selected: {},
    peopleFinder: false,
    churchFinder: false,
    perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
    pagination: { sortBy: 'id' },
    params: {
      au_s_date: null,
      au_e_date: null,
      v_name: '',
      s_name: '',
      memo: ''
    },
    headers: [
      { text: 'ID', value: 'id' },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '선서일', value: 'au_date' },
      { text: '교구명', value: 'la_name' },
      { text: '본당명', value: 'sa_name' },
      { text: '교육', value: 'edu_cnt' },
      // { text: '그룹', value: 'grp_cnt' },
      { text: '봉사', value: 'act_cnt' },
      { text: '메모', value: 'memo' }
    ]
  }),
  methods: {
    reset () {
      this.resetCode()
      this.params.au_s_date = this.params.au_e_date = null
      this.params.v_name = this.params.s_name = this.params.memo = ''
      this.small.model = ''
    },
    submit () {
      // let isEmpty = true
      Object.keys(this.formData).forEach(f => {
        const obj = this.formData[f]
        // if (obj) isEmpty = false
        if (f === 'v_name') this.params.v_name = obj && obj.replace(/\s*/g, '')
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
      }, 10)
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
    onBlur () {
      console.log('blur', this.small.model)
    },
    onChangedCode (type, val) {
      if (type === 'm' && !val) this.params.area_code = this.areaCode.la_code
      else if (type === 's' && !val) this.params.area_code = this.areaCode.ma_code

      this.params.a_code = this.params.area_code
      // console.log(type, val, this.params.a_code)
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
  .w-5 {
    width: 5% !important;
  }
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
