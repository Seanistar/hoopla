<template>
  <div class="tp-10">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">성경 공부 내역</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-text-field v-model="dlgItem.id" label="ID" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field v-model="dlgItem.edu_code" label="교육 항목 코드"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select label="교육 내용" v-model="dlgItem.edu_code"
                            :items="eduCodes" item-text="name" item-value="code"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <date-picker ref="s_date" refs="edu-s_date" title="교육 시작일"
                  ></date-picker>
                </v-flex>
                <v-flex xs12 sm6>
                  <date-picker ref="e_date" refs="edu-e_date" title="교육 종료일"
                  ></date-picker>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="dlgItem.sv_ids" label="봉사자"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="dlgItem.memo" label="참고 사항"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="orange darken-1" outline flat
                   @click="dialog = false">취소</v-btn>
            <v-btn color="blue darken-1" outline flat
                   @click="saveItem">저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="volunteerEdus"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.edu_name }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.sv_ids }}</td>
          <td class="text-xs-left">{{ props.item.memo }}</td>
        </tr>
      </template>
      <template slot="no-data" v-cloak>
        <v-alert :value="true" color="error" icon="warning">
          교육 내역이 없습니다.
        </v-alert>
      </template>
    </v-data-table>
    <inline-buttons refs="edu"/>
  </div>
</template>

<script>
import InlineButtons from './control/InlineButtons'
import InputDialog from './control/InputDialog'
import DatePicker from './control/DatePicker'
import {isEmpty, isNull, isUndefined} from 'lodash/lang'
import {FETCH_VOLUNTEER_EDUS, CREATE_VOLUNTEER_EDU, UPDATE_VOLUNTEER_EDU, DELETE_VOLUNTEER_EDU} from '../store/actions.type'

const DEFALUT_ITEM = {id: null, s_date: '', e_date: '', edu_code: null, edu_name: '', sv_ids: '', memo: ''}
export default {
  name: 'VolunteerEdus',
  components: { InputDialog, InlineButtons, DatePicker },
  props: { v_id: null },
  computed: {
    volunteerEdus: {
      get () {
        return this.$store.state.volunteer.volunteerEdus
      },
      set (data) {
        this.$store.dispatch(CREATE_VOLUNTEER_EDU, data)
      }
    },
    eduCodes () {
      return this.$store.getters.eduCodes
    }
  },
  watch: {
    'selected.id' (val) {
      console.log(val)
    },
    'dlgItem.edu_code' (val) {
      if (isNull(val)) return
      const res = this.eduCodes.find(o => o.code === val)
      this.dlgItem.edu_name = res.name
      // console.log(this.dlgItem.edu_name)
    }
  },
  data: () => ({
    selected: {},
    dialog: false,
    dlgItem: {},
    headers: [
      { text: '번호', align: 'center', value: 'id' },
      { text: '교육 내용', align: 'center', value: 'subject' },
      { text: '교육 시작일', align: 'center', value: 's_date' },
      { text: '교육 종료일', align: 'center', value: 'e_date' },
      { text: '지원 봉사자', align: 'center', value: 'sponsor', sortable: false },
      { text: '참고사항', align: 'center', value: 'memo', sortable: false }
    ]
  }),
  created () {
    this.fetchData()

    const _this = this
    this.$eventBus.$on('close-date-picker-edu-s_date', (date) => {
      _this.dlgItem.s_date = date
    })
    this.$eventBus.$on('close-date-picker-edu-e_date', (date) => {
      _this.dlgItem.e_date = date // TODO: check it that s_date must be previous e_date
    })
    this.$eventBus.$on('click-btn-edu', (eventType) => {
      if (eventType === 'add') {
        _this.dlgItem = DEFALUT_ITEM
        _this.dlgItem.id = _this.volunteerEdus.length + 1
      } else if (eventType === 'remove') {
        if (isEmpty(_this.selected)) return alert('내역을 선택해주세요.')
        return confirm('선택 항목을 삭제하시겠습니까?') && _this.deleteEduItem(_this.selected.id)
      } else if (eventType === 'edit') {
        if (isEmpty(_this.selected)) return alert('내역을 선택해주세요.')
        _this.dlgItem = _this.selected
        _this.$refs['s_date'].setDate(_this.dlgItem.s_date)
        _this.$refs['e_date'].setDate(_this.dlgItem.e_date)
      }
      _this.dialog = true
    })
  },
  methods: {
    saveItem () {
      this.dialog = false
      this.dlgItem.v_id = this.v_id
      if (isUndefined(this.selected.id)) {
        this.volunteerEdus = this.dlgItem
      } else {
        this.updateEduItem(this.dlgItem)
      }
    },
    updateEduItem (item) {
      this.$store.dispatch(UPDATE_VOLUNTEER_EDU, item)
    },
    deleteEduItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_EDU, id)
    },
    async fetchData () {
      this.selected = {}
      if (isUndefined(this.v_id)) return
      await this.$store.dispatch(FETCH_VOLUNTEER_EDUS, this.v_id)
    }
  }
}
</script>

<style scoped>
</style>
