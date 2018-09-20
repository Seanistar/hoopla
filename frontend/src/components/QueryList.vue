<template>
  <div class="mb-4">
    <v-form ref="form">
      <v-container class="elevation-4 py-1 w-85">
        <v-layout row wrap pl-2>
          <v-flex xs12 sm3>
            <v-select label="교구" v-model="areaCode.la_code" hide-details class="body-1"
                      :items="lAreaCodes" item-text="l_name" item-value="l_code"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select label="교구 > 지구" v-model="areaCode.ma_code" hide-details no-data-text="지구 자료가 없습니다."
                      :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select label="교구 > 지구 > 본당" v-model="areaCode.sa_code" hide-details no-data-text="본당 자료가 없습니다."
                      :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap pl-2>
          <v-flex xs3>
            <v-select label="선서연도" v-model="params.au_date" hide-details
                      :items="years"
            ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="봉사자이름" v-model="params.v_name" @keyup.enter="submit"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-combobox label="본당이름"
                        v-model="small.model" :items="small.items" item-value="code" item-text="name"
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
            </v-combobox>
          </v-flex>
          <v-flex xs3>
            <v-layout align-end justify-end row>
              <v-btn color="orange accent-2" outline class="mt-3" @click="reset">초기화</v-btn>
              <v-btn color="indigo accent-2" outline class="mt-3" @click="submit">조회</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-divider class="my-3"></v-divider>
    <v-container class="elevation-2 w-85">
      <v-btn fixed dark fab style="top: 40%" right color="pink"><v-icon>add</v-icon></v-btn>
      <v-layout pb-2>
        <v-flex xs12>
          <div>조회 결과 수 : {{queryCount}} 건</div>
        </v-flex>
      </v-layout>
      <v-data-table :headers="headers" :items="queryVolunteers" :loading="queried && isQuerying"
                    hide-actions no-data-text="조회 조건을 선택하세요."
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr @click="selected = props.item" @dblclick="onClickResult(props.item)"
              :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">
            <td class="text-xs-center">{{ props.item.id }}</td>
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.ca_name }}</td>
            <td class="text-xs-center">{{ props.item.au_date|yearstamp }}</td>
            <td class="text-xs-center">{{ props.item.la_name }}</td>
            <td class="text-xs-center">{{ props.item.sa_name }}</td>
            <td class="text-xs-center">{{ props.item.edu_count }}</td>
            <td class="text-xs-center">{{ props.item.act_count }}</td>
          </tr>
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
    formData () {
      return {
        a_code: this.params.area_code,
        v_name: this.params.v_name,
        au_date: this.params.au_date,
        sa_code: this.small.model ? this.small.model.code : ''
      }
    },
    years () {
      const start = (new Date()).getFullYear()
      return range(start, 1972, -1)
    }
  },
  watch: {
    'small.model' (val) {
      if (val && val.length > 5) {
        this.$nextTick(() => this.small.model.pop())
      }
    }
  },
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    const list = map(this.smallCodes, o => {
      return {code: o.s_code, name: o.s_name}
    })
    this.small.items = orderBy(list, ['name'])
  },
  data: () => ({
    small: {
      items: [],
      model: '',
      search: null
    },
    queried: false,
    selected: {},
    peopleFinder: false,
    churchFinder: false,
    params: {
      au_date: null,
      v_name: ''
    },
    headers: [
      { text: 'ID', value: 'id' },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '선서일', value: 'au_date' },
      { text: '교구명', value: 'la_name' },
      { text: '본당명', value: 'san_ame' },
      { text: '교육 횟수', value: 'edu_cnt' },
      { text: '봉사 횟수', value: 'act_cnt' }
    ]
  }),
  methods: {
    reset () {
      this.resetCode()
      this.params.au_date = null
      this.params.v_name = ''
      this.small.model = ''
    },
    submit () {
      let isEmpty = true
      Object.keys(this.formData).forEach(f => {
        if (this.formData[f]) isEmpty = false
      })
      if (isEmpty) return alert('조회할 항목을 설정하세요.')

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
        this.$router.push({name: 'view-query'})
      }, 10)
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
    }
  }
}
</script>

<style scoped>
  .v-input label {
    font-size: 13px !important;
  }
</style>
