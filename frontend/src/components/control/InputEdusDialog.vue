<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline pa-2">교육 정보</span>
          <!--<span v-if="refs === 'acts'" class="pl-3"
                :class="item.id ? ['green&#45;&#45;text', 'subheading', 'font-weight-bold'] : ['red&#45;&#45;text'] ">{{voltCode}}
          </span>-->
        </v-card-title>

        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6>
                <v-text-field label="이름" v-model="item.name"
                              :disabled="item.id !== 0 || (item.id === 0 && item.name !== undefined)"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="세례명" v-model="item.ca_name"
                              :disabled="item.id !== 0 || (item.id === 0 && item.name !== undefined)"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-select label="교육 대분류" v-model="eduType" hide-details
                          :items="large_edus" item-text="name" item-value="value"
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <v-select label="교육 항목" v-model="item.edu_code" hide-details
                          :items="smallEdus()" item-text="name" item-value="code"
                ></v-select>
              </v-flex>
              <!--<v-flex :class="isMonthEdu || isNoteCheck ? 'xs6' : 'xs12'">
                <v-select label="교육 항목" v-model="item.edu_code" hide-details
                          :items="eduCodes" item-text="name" item-value="code"
                ></v-select>
              </v-flex>-->

              <v-flex xs6 v-if="isMonthEdu">
                <v-layout row>
                  <v-flex xs4>
                    <v-checkbox label="횟수" hide-details v-model="isECount"></v-checkbox>
                  </v-flex>
                  <v-flex xs8>
                    <v-select label="연도선택" class="ml-3 text-xs-center body-1"
                              single-line hide-details
                              :items="years" v-model="item.r_year"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs6 v-else-if="isNoteCheck">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-checkbox label="날짜 미상" hide-details v-model="isECount"></v-checkbox>
                  </v-flex>
                  <v-flex xs6>
                    <v-checkbox label="준비중" hide-details v-model="item.ready" ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 v-if="isMonthEdu">
                <template v-if="isECount">
                  <v-radio-group v-model="selected" row>
                    <v-layout wrap>
                      <v-radio label="1회" value="1"></v-radio>
                      <v-radio label="2회" value="2"></v-radio>
                      <v-radio label="3회" value="3"></v-radio>
                      <v-radio label="4회" value="4"></v-radio>
                      <v-radio label="5회" value="5"></v-radio>
                    </v-layout>
                    <v-layout wrap>
                      <v-radio label="6회" value="6"></v-radio>
                      <v-radio label="7회" value="7"></v-radio>
                      <v-radio label="8회" value="8"></v-radio>
                      <v-radio label="9회" value="9"></v-radio>
                      <v-radio label="10회" value="10"></v-radio>
                    </v-layout>
                  </v-radio-group>
                </template>
                <template v-else>
                  <v-layout wrap>
                    <v-checkbox v-model="selected" label="3월" value="3"></v-checkbox>
                    <v-checkbox v-model="selected" label="4월" value="4"></v-checkbox>
                    <v-checkbox v-model="selected" label="5월" value="5"></v-checkbox>
                    <v-checkbox v-model="selected" label="6월" value="6"></v-checkbox>
                    <v-checkbox v-model="selected" label="7월" value="7"></v-checkbox>
                  </v-layout>
                  <v-layout wrap>
                    <v-checkbox v-model="selected" label="8월" value="8"></v-checkbox>
                    <v-checkbox v-model="selected" label="9월" value="9"></v-checkbox>
                    <v-checkbox v-model="selected" label="10월" value="10"></v-checkbox>
                    <v-checkbox v-model="selected" label="11월" value="11"></v-checkbox>
                    <v-checkbox v-model="selected" label="12월" value="12"></v-checkbox>
                  </v-layout>
                </template>
              </v-flex>
              <v-layout row wrap v-else-if="!isNoteCheck || !isECount">
                <v-flex xs6>
                  <!--<date-picker ref="s_date" title="교육 시작일" :disabled="isMonthEdu" @close-date-picker="onPicked" refs="s_date"></date-picker>-->
                  <v-text-field label="교육 시작일" hide-details mask="####-##-##" v-model="item.s_date"></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <!--<date-picker ref="e_date" title="교육 종료일" :disabled="isMonthEdu" @close-date-picker="onPicked" refs="e_date"></date-picker>-->
                  <v-text-field label="교육 종료일" hide-details mask="####-##-##" v-model="item.e_date"></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs8>
                <v-text-field label="봉사자 이름" v-model="item.gv_name"
                              @focus="finder = false" clearable hide-details></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-btn color="blue darken-1" outline flat class="finder"
                       @click.prevent="finder = true">봉사자 찾기</v-btn>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="참고 사항" v-model="item.memo" hide-details></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions class="mr-3 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" outline flat
                 @click.prevent="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" outline flat
                 @click.prevent="closeDialog">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <people-dialog :visible="finder" @close-find-people="onFound"/>
  </v-layout>
</template>

<script>
import DatePicker from './DatePicker'
import PeopleDialog from './FindPeopleDialog'
import { ACTIVITY_STATES } from '../../common/const.info'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash/lang'
import { range } from 'lodash/util'
import { filter } from 'lodash/collection'

export default {
  name: 'EdusDialog',
  components: { DatePicker, PeopleDialog },
  props: {
    visible: false
    // refs: { type: String, default: '' }
  },
  computed: {
    ...mapGetters([
      'eduCodes',
      'smallCodes',
      'actCodes'
    ]),
    dialog: {
      get () { return this.visible },
      set () {
        this.reset()
        this.$emit('close-input-item')
      }
    },
    isMonthEdu () {
      return this.item.edu_code === 53 && !this.item.id
    },
    isNoteCheck () {
      return this.item.edu_code >= 70 && this.item.edu_code <= 80
    },
    isGroupStudy () {
      return this.item.edu_code >= 120 && this.item.edu_code <= 130
    },
    years () {
      const start = (new Date()).getFullYear()
      return ['선택없음'].concat(range(start, 2006, -1))
    },
    large_edus () {
      return [
        {name: '기본 교육', value: 'E'},
        {name: '노트 검사', value: 'N'},
        {name: '성서 연수', value: 'T'},
        {name: '그룹 공부', value: 'G'},
        {name: '마두명', value: 'M'}
      ]
    }
  },
  watch: {
    'item.edu_code' (code) {
      if (!code) return
      const res = this.eduCodes.find(e => e.code === code)
      if (res) this.item.edu_name = res.name
      this.isECount = false
    },
    eduType (val) {
      this.isECount = false
      // this.item.edu_code = null
    }
    /* 'item.e_date' (date) {
      if (!this.item.s_date || !date) return
      if (date < this.item.s_date) {
        alert('종료일이 시작일보다 빠릅니다.')
        this.$refs['e_date'].setDate(null)
      }
    } */
  },
  data: () => ({
    finder: false,
    states: ACTIVITY_STATES,
    selected: [],
    isECount: false,
    eduType: null,
    item: { id: 0 }
  }),
  created () {
    this.item.s_date = this.item.e_date = this.item.r_year = ''
    this.item.edu_code = this.item.edu_name = null
    this.item.ready = false
  },
  methods: {
    closeDialog () {
      if (this.isNoteCheck && (this.isECount || this.item.ready)) {
        this.$emit('close-input-item', this.item)
        this.reset()
        return
      }
      if (this.item.edu_code === 53) {
        if (!this.item.r_year || this.item.r_year === '선택없음') return alert('시작 연도를 확인해주세요!')
      } else {
        if (!this.item.e_date || !this.item.s_date) return alert('기간을 확인해주세요!')
        this.item.s_date = this.makeDate(this.item.s_date, true)
        this.item.e_date = this.makeDate(this.item.e_date, false)
        /* if (this.item.e_date < this.item.s_date) {
          this.$refs['e_date'].setDate(null)
          return alert('종료일이 시작일보다 빠릅니다!')
        } */
      }
      if (this.isECount) this.selected = range(3, 3 + parseInt(this.selected[0]))
      this.item.months = this.selected.join(',')
      this.$emit('close-input-item', this.item)
      this.reset()
    },
    makeDate (date, isStart) {
      if (date.length <= 4) return date + (isStart ? '0101' : '1231')
      else if (date.length <= 6) return date + (isStart ? '01' : '28')
      return date
    },
    smallEdus () {
      if (!this.eduType) return
      return filter(this.eduCodes, e => e.type === this.eduType)
    },
    reset () {
      this.isECount = false
      this.item = { v_id: 0, ready: false }; this.selected = []
      const sdr = this.$refs['s_date']; sdr && sdr.setDate(null)
      const edr = this.$refs['e_date']; edr && edr.setDate(null)
    },
    setItem (data) {
      if (data !== undefined) this.item = cloneDeep(data)
      if (this.isNoteCheck) {
        this.item.ready = this.item.ready === 'Y'
        this.$nextTick(() => (this.isECount = !this.item.s_date))
      }
      const sdr = this.$refs['s_date']; sdr && sdr.setDate(data.s_date)
      const edr = this.$refs['e_date']; edr && edr.setDate(data.e_date)
    },
    onPicked (obj) {
      console.log('picked date...', obj.type, obj.date)
      this.item[obj.type] = obj.date
    },
    onFound (data) {
      if (data === undefined) { this.finder = false; return }
      if (this.item.s_code && this.item.s_code !== data.area_code) {
        return alert('구역 정보가 일치하지 않습니다. 다시 선택해주세요!')
      }

      this.finder = false
      Object.assign(this.item, {gv_id: data.id, gv_name: `${data.name} ${data.ca_name}`})
      console.log('found people...', this.item)
    }
  }
}
</script>

<style scoped>
  .w-31 {
    width: 30%;
  }
  .w-41 {
    width: 37%;
  }
  .finder {
    top: 7px;
    left: 25px;
  }
</style>
