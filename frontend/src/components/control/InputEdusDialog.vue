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
              <v-flex xs12>
                <v-select label="교육 항목" v-model="item.edu_code" hide-details
                          :items="eduCodes" item-text="name" item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 v-if="item.edu_code === 53 && !item.id"> <!-- 월교육인 경우에만 보여줌 -->
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
              </v-flex>
              <v-flex xs6>
                <date-picker ref="s_date" title="교육 시작일"
                             @close-date-picker="onPicked" refs="s_date"></date-picker>
              </v-flex>
              <v-flex xs6>
                <date-picker ref="e_date" title="교육 종료일"
                             @close-date-picker="onPicked" refs="e_date"></date-picker>
              </v-flex>
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
    }
  },
  watch: {
    'item.edu_code' (code) {
      if (!code) return
      const res = this.eduCodes.find(e => e.code === code)
      if (res) this.item.edu_name = res.name
    },
    'item.e_date' (date) {
      if (!this.item.s_date || !date) return
      if (date < this.item.s_date) {
        alert('종료일이 시작일보다 빠릅니다.')
        this.$refs['e_date'].setDate(null)
      }
    }
  },
  data: () => ({
    finder: false,
    states: ACTIVITY_STATES,
    selected: [],
    item: { id: 0 }
  }),
  created () {
    this.item.s_date = this.item.e_date = ''
    this.item.edu_code = this.item.edu_name = null
  },
  methods: {
    closeDialog () {
      if (this.item.edu_code !== 53) {
        if (!this.item.e_date || !this.item.s_date) return alert('기간을 확인해주세요!')
        if (this.item.e_date < this.item.s_date) {
          this.$refs['e_date'].setDate(null)
          return alert('종료일이 시작일보다 빠릅니다!')
        }
      }
      this.item.months = this.selected.join(',')
      this.$emit('close-input-item', this.item)
      this.reset()
    },
    reset () {
      this.item = { v_id: 0 }; this.selected = []
      const sdr = this.$refs['s_date']; sdr && sdr.setDate(null)
      const edr = this.$refs['e_date']; edr && edr.setDate(null)
    },
    setItem (data) {
      if (data !== undefined) this.item = cloneDeep(data)
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
