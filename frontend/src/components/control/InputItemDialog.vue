<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline pa-2">{{title}}</span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-container grid-list-md v-if="refs === 'volts'">
            <v-layout row wrap>
                <v-flex xs4><span class="subheading grey--text">봉사자 고유코드 :</span></v-flex>
                <v-flex xs6><span class="subheading" :class="item.id ? 'green--text' : 'red--text' ">{{voltCode}}</span></v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs8>
                <v-text-field v-model="item.name" @focus="finder = true" hide-details label="봉사자 이름"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-layout justify-end>
                  <v-btn color="grey darken-1" outline class="mt-3" @click="finder = true">봉사자 찾기</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.ca_name" hide-details label="세례명"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.phone" hide-details mask="###-####-####" label="연락처"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.address" hide-details label="주소"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="item.br_date" hide-details label="생년월일"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-select label="활동상태" :items="states" item-text="nm" item-value="cd" v-model="item.state"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container grid-list-md v-else-if="refs === 'acts'">
            <v-layout row wrap>
              <v-flex xs4><span class="subheading grey--text">봉사자 고유코드 :</span></v-flex>
              <v-flex xs6><span class="subheading" :class="item.id ? 'green--text' : 'red--text' ">{{voltCode}}</span></v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs8>
                <v-text-field v-model="item.name" @focus="finder = true" hide-details label="봉사자 이름"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-layout justify-end>
                  <v-btn color="grey darken-1" outline class="mt-3" @click="finder = true">봉사자 찾기</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.ca_name" hide-details label="세례명"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select label="봉사 그룹명" :items="groups" item-text="name" hide-details item-value="code" v-model="item.grp_code"></v-select>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="item.grp_count" hide-details label="그룹 수"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="item.numbers" hide-details label="인원 수"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="s_date" title="봉사 시작일" @close-date-picker="onPicked" refs="s_date"
                ></date-picker>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="e_date" title="봉사 종료일" @close-date-picker="onPicked" refs="e_date"
                ></date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.content" hide-details label="봉사활동 내용"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container grid-list-md v-else-if="refs === 'edus'">
            <v-layout wrap>
              <v-flex xs6>
                <v-text-field v-model="item.name" @focus="finder = true" hide-details label="이름"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="item.ca_name" hide-details label="세례명"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select label="교육 항목" v-model="item.edu_code" hide-details
                          :items="eduCodes" item-text="name" item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs6>
                <date-picker ref="s_date" title="교육 시작일" @close-date-picker="onPicked" refs="s_date"
                ></date-picker>
              </v-flex>
              <v-flex xs6>
                <date-picker ref="e_date" title="교육 종료일" @close-date-picker="onPicked" refs="e_date"
                ></date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.gv_id" @focus="finder = true" hide-details label="봉사자 이름"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.memo" hide-details label="참고 사항"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container grid-list-md v-else-if="refs === 'codes'">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="item.code" label="구역 코드" readonly></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.name" label="구역 이름"></v-text-field>
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
import { pick } from 'lodash/object'
// import { cloneDeep } from 'lodash/lang'

export default {
  name: 'InputItemDialog',
  components: { DatePicker, PeopleDialog },
  props: {
    visible: false,
    refs: { type: String, default: '' }
  },
  computed: {
    title () {
      if (this.refs === 'volts') return '봉사자 정보'
      else if (this.refs === 'acts') return '봉사활동 정보'
      else if (this.refs === 'codes') return '구역코드 정보'
      else if (this.refs === 'edus') return '교육 정보'
    },
    voltCode () {
      return this.item.id ? `${this.item.area_code}-${this.item.id}` : '코드 확인이 필요합니다!'
    },
    groups () {
      return this.$store.getters.actCodes
    },
    eduCodes () {
      return this.$store.getters.eduCodes
    },
    dialog: {
      get () {
        return this.visible
      },
      set () {
        this.reset()
        this.$emit('close-input-item')
      }
    }
  },
  data: () => ({
    finder: false,
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
      const sdr = this.$refs['s_date']
      sdr && sdr.setDate(null)
      const edr = this.$refs['e_date']
      edr && edr.setDate(null)
    },
    setItem (data) {
      this.item = data
      const sdr = this.$refs['s_date']
      sdr && sdr.setDate(data.s_date)
      const edr = this.$refs['e_date']
      edr && edr.setDate(data.e_date)
    },
    onPicked (obj) {
      console.log('picked date...', obj.type, obj.date)
      this.item[obj.type] = obj.date
    },
    onFound (data) {
      this.finder = false
      if (data === undefined) return

      this.item = pick(data, ['id', 'name', 'ca_name', 'phone', 'address', 'state', 'br_date', 'area_code'])
      console.log('found people...', this.item)
    }
  }
}
</script>

<style scoped>
</style>
