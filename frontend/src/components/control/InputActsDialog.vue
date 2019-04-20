<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline pa-2">봉사활동 정보</span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-container grid-list-md class="pt-0">
            <v-layout wrap>
              <template>
                <v-flex xs6>
                  <v-text-field label="봉사자 이름" v-model="item.name" @focus="finder = true"
                                :disabled="refs === 'volunteer'"
                                hide-details></v-text-field><!--:disabled="item.id !== 0 || (item.id === 0 && item.name !== undefined)"-->
                </v-flex>
                <v-flex xs6>
                  <v-text-field label="세례명" v-model="item.ca_name"
                                :disabled="refs === 'volunteer'"
                                hide-details></v-text-field>
                </v-flex>
              </template>
              <!--<template v-else-if="refs === 'report'">
                <v-flex xs8>
                  <v-text-field label="봉사자 이름" v-model="item.name" @focus="finder = false" hide-details></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-layout justify-end>
                    <v-btn color="blue darken-1" outline class="mt-3" @click="finder = true">봉사자 찾기</v-btn>
                  </v-layout>
                </v-flex>
              </template>-->

              <v-flex xs6>
                <v-select label="봉사 그룹명" :items="actCodes" item-text="name" item-value="code"
                          hide-details v-model="item.act_code"></v-select>
              </v-flex>
              <v-flex xs6>
                <v-text-field label="인원 수" v-model="item.numbers" suffix="명" hide-details></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="봉사한 구역 (본당)" clearable hide-details
                              @focus="churchFinder = true" v-model="item.s_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <!--<date-picker ref="s_date" title="봉사 시작일" @close-date-picker="onPicked" refs="s_date"></date-picker>-->
                <v-text-field label="봉사 시작일" hide-details mask="####-##-##" v-model="item.s_date"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <!--<date-picker ref="e_date" title="봉사 종료일" @close-date-picker="onPicked" refs="e_date"></date-picker>-->
                <v-text-field label="봉사 종료일" hide-details mask="####-##-##" v-model="item.e_date"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.content" hide-details label="봉사활동 내용"></v-text-field>
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
import { cloneDeep } from 'lodash/lang'

export default {
  name: 'InputItemDialog',
  components: { DatePicker, PeopleDialog, ChurchDialog },
  props: {
    visible: false,
    refs: { type: String, default: '' }
  },
  computed: {
    ...mapGetters([
      'smallCodes',
      'actCodes'
    ]),
    dialog: {
      get () { return this.visible },
      set () {
        this.reset()
        this.$emit('close-input-item')
      }
    }
  },
  /* watch: {
    'item.e_date' (date) {
      if (!this.item.s_date || !date) return
      if (date < this.item.s_date) {
        alert('종료일이 시작일보다 빠릅니다.')
        this.$refs['e_date'].setDate(null)
      }
    }
  }, */
  data: () => ({
    finder: false,
    churchFinder: false,
    states: ACTIVITY_STATES,
    item: {}
  }),
  created () {
    this.item.id = 0
    this.item.s_date = this.item.e_date = ''
  },
  methods: {
    closeDialog () {
      // if (!this.item.id) return alert('코드 확인이 되지 않았습니다!')
      // if (!this.item.e_date || !this.item.s_date) return alert('기간을 확인해주세요!')
      this.makeDate()
      /* if (this.item.e_date < this.item.s_date) {
        this.$refs['e_date'].setDate(null)
        return alert('종료일이 시작일보다 빠릅니다!')
      } */
      this.$emit('close-input-item', this.item)
      this.reset()
    },
    makeDate () {
      const sDate = this.item.s_date
      if (!sDate) return alert('시작 연도를 입력해주세요!')
      if (sDate.length <= 4) this.item.s_date += '0101'
      else if (sDate.length <= 6) this.item.s_date += '01'

      this.item.e_date = sDate
      if (sDate.length <= 4) this.item.e_date += '1231'
      else if (sDate.length <= 6) this.item.e_date += '28'
    },
    /* makeDate (date, isStart) {
      if (date.length <= 4) return date + (isStart ? '0101' : '1231')
      else if (date.length <= 6) return date + (isStart ? '01' : '28')
      return date
    }, */
    reset () {
      this.item = { id: 0 }
      // const sdr = this.$refs['s_date']; sdr && sdr.setDate(null)
      // const edr = this.$refs['e_date']; edr && edr.setDate(null)
    },
    setItem (data) {
      if (data !== undefined) this.item = cloneDeep(data)
      // const sdr = this.$refs['s_date']; sdr && sdr.setDate(data.s_date)
      // const edr = this.$refs['e_date']; edr && edr.setDate(data.e_date)
    },
    onPicked (obj) {
      console.log('picked date...', obj.type, obj.date)
      this.item[obj.type] = obj.date
    },
    onFound (data) {
      if (data === undefined) { this.finder = false; return }
      if (!data.area_code) return this.$showSnackBar('구역 정보를 확인해주세요!')
      /* if (this.item.s_code && this.item.s_code !== data.area_code) {
        return alert('구역 정보가 일치하지 않습니다. 다시 선택해주세요!')
      } */

      this.finder = false
      Object.assign(this.item, pick(data, ['id', 'name', 'ca_name', 'state', 'area_code']))
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
  .finder {
    top: 7px;
    left: 25px;
  }
</style>
