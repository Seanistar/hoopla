<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline pa-2">{{title}}</span>
          <span v-if="refs === 'acts'" class="pl-3"
                :class="item.id ? ['green--text', 'subheading', 'font-weight-bold'] : ['red--text'] ">{{voltCode}}
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-container grid-list-md v-if="refs === 'volts'">
            <v-layout row wrap>
                <v-flex xs4><span class="subheading grey--text">봉사자 고유코드 :</span></v-flex>
                <v-flex xs6><span class="subheading" :class="item.id ? 'green--text' : 'red--text' ">{{voltCode}}</span></v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs8>
                <v-text-field label="봉사자 이름" v-model="item.name" @focus="finder = true" hide-details></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-layout justify-end>
                  <v-btn color="grey darken-1" outline class="mt-3" @click="finder = true">봉사자 찾기</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="세례명" v-model="item.ca_name" hide-details></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="연락처" v-model="item.phone" hide-details mask="###-####-####"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="주소" v-model="item.address" hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="생년월일" v-model="item.br_date" hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-select label="활동상태" v-model="item.state" :items="states" item-text="nm" item-value="cd"></v-select>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container grid-list-md v-else-if="refs === 'acts'" class="pt-0">
            <v-layout wrap>
              <v-flex xs6>
                <v-text-field label="봉사자 이름" v-model="item.name"
                              :disabled="item.id !== 0 || (item.id === 0 && item.name !== undefined)"
                              @focus="finder = true" hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="세례명" v-model="item.ca_name"
                              :disabled="item.id !== 0 || (item.id === 0 && item.ca_name !== undefined)"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-select label="봉사 그룹명" :items="actCodes" item-text="name" item-value="code"
                          hide-details v-model="item.act_code"></v-select>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="인원 수" v-model="item.numbers" hide-details></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="봉사한 구역 (본당)" clearable hide-details
                              :disabled="item.id !== 0 || (item.id === 0 && item.s_name !== undefined)"
                              @focus="churchFinder = true" v-model="item.s_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="s_date" title="봉사 시작일"
                             @close-date-picker="onPicked" refs="s_date"></date-picker>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="e_date" title="봉사 종료일"
                             @close-date-picker="onPicked" refs="e_date"></date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.content" hide-details label="봉사활동 내용"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container grid-list-md v-else-if="refs === 'edus'">
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
              <v-flex xs12>
                <v-select label="교육 항목" v-model="item.edu_code" hide-details
                          :items="eduCodes" item-text="name" item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <date-picker ref="s_date" title="교육 시작일"
                             @close-date-picker="onPicked" refs="s_date"></date-picker>
              </v-flex>
              <v-flex xs6>
                <date-picker ref="e_date" title="교육 종료일"
                             @close-date-picker="onPicked" refs="e_date"></date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="봉사자 이름" v-model="item.gv_name"
                              @focus="finder = true" clearable hide-details></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="참고 사항" v-model="item.memo" hide-details></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container grid-list-md v-else-if="refs === 'codes'">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="구역 코드" v-model="item.code" readonly></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="구역 이름" v-model="item.name"></v-text-field>
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
    <church-dialog :visible="churchFinder" @close-find-church="onChurchFound"/>
  </v-layout>
</template>

<script>
import DatePicker from './DatePicker'
import PeopleDialog from './FindPeopleDialog'
import ChurchDialog from './FindChurchDialog'
import { ACTIVITY_STATES } from '../../common/const.info'
import { pick } from 'lodash/object'
import { mapGetters } from 'vuex'

export default {
  name: 'InputItemDialog',
  components: { DatePicker, PeopleDialog, ChurchDialog },
  props: {
    visible: false,
    refs: { type: String, default: '' }
  },
  computed: {
    ...mapGetters([
      'eduCodes',
      'smallCodes',
      'actCodes'
    ]),
    title () {
      if (this.refs === 'volts') return '봉사자 정보'
      else if (this.refs === 'acts') return '봉사활동 정보'
      else if (this.refs === 'codes') return '구역코드 정보'
      else if (this.refs === 'edus') return '교육 정보'
    },
    voltCode () {
      return this.item.id !== 0 ? `봉사자코드 : ${this.item.area_code}-${this.item.id}` : '봉사자코드 확인이 필요합니다!'
    },
    dialog: {
      get () { return this.visible },
      set () {
        this.reset()
        this.$emit('close-input-item')
      }
    }
  },
  data: () => ({
    finder: false,
    churchFinder: false,
    states: ACTIVITY_STATES,
    item: {}
  }),
  created () {
    this.item.id = 0
    if (this.refs === 'volts') {
      this.item.state = 'ACT'
    } else if (this.refs === 'acts') {
      this.item.s_date = this.item.e_date = ''
    }
  },
  methods: {
    closeDialog () {
      if (!this.item.id) return alert('코드 확인이 되지 않았습니다.')
      this.$emit('close-input-item', this.item)
      this.reset()
    },
    reset () {
      this.item = { id: 0 }
      const sdr = this.$refs['s_date']; sdr && sdr.setDate(null)
      const edr = this.$refs['e_date']; edr && edr.setDate(null)
    },
    setItem (data) {
      this.item = data
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
      if (this.refs === 'acts') Object.assign(this.item, pick(data, ['id', 'name', 'ca_name', 'state', 'area_code']))
      else if (this.refs === 'edus') Object.assign(this.item, {gv_id: data.id, gv_name: `${data.name} ${data.ca_name}`})
      else this.item = pick(data, ['id', 'name', 'ca_name', 'phone', 'address', 'state', 'br_date', 'area_code'])
      console.log('found people...', this.item)
    },
    onChurchFound (data) {
      this.churchFinder = false
      if (data === undefined) return

      this.item.s_code = data.s_code
      this.item.s_name = data.s_name
      console.log('found church...', this.item)
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
</style>
