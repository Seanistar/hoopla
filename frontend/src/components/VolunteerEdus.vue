<template>
  <v-container>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title class="pb-0">
            <span class="title">성경 공부 내역</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md class="pa-2">
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
                <v-layout pb-3>
                  <v-flex xs12 sm6>
                    <date-picker ref="s_date" title="교육 시작일"  @close-date-picker="onPicked" refs="s_date"
                    ></date-picker>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <date-picker ref="e_date" title="교육 종료일"  @close-date-picker="onPicked" refs="e_date"
                    ></date-picker>
                  </v-flex>
                </v-layout>
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
    <v-layout row justify-end>
      <v-flex xs12 sm2 offset-sm4>
        <menu-buttons class="pt-0 pb-1" refs="edu" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="volunteerEdus" hide-actions class="elevation-1"
                  :loading="isLoading"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.edu_name }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.memo }}</td>
        </tr>
      </template>
      <template slot="no-data" v-if="fetched">
          교육 내역이 없습니다.
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// import InlineButtons from './control/InlineButtons'
import MenuButtons from './control/MenuButtons'
import InputDialog from './control/InputDialog'
import DatePicker from './control/DatePicker'
import { isEmpty, isNull, isUndefined } from 'lodash/lang'
import { FETCH_VOLUNTEER_EDUS, CREATE_VOLUNTEER_EDU, UPDATE_VOLUNTEER_EDU, DELETE_VOLUNTEER_EDU } from '../store/actions.type'

export default {
  name: 'VolunteerEdus',
  components: { InputDialog, MenuButtons, DatePicker },
  props: { v_id: undefined },
  computed: {
    volunteerEdus: {
      get () {
        return this.$store.state.volunteer.volunteerEdus
      },
      set (data) {
        this.$store.dispatch(CREATE_VOLUNTEER_EDU, data)
      }
    },
    volunteerInfo () {
      return this.$store.getters.volunteerInfo(parseInt(this.v_id))
    },
    isLoading () {
      return isUndefined(this.v_id) ? false : this.$store.getters.isVolunteersLoading
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
    fetched: false,
    dlgItem: {},
    headers: [
      { text: '번호', align: 'center', value: 'id' },
      { text: '교육 내용', align: 'center', value: 'subject' },
      { text: '교육 시작일', align: 'center', value: 's_date' },
      { text: '교육 종료일', align: 'center', value: 'e_date' },
      { text: '참고 사항', align: 'center', value: 'memo', sortable: false }
    ]
  }),
  created () {
    this.fetchData()

    const _this = this
    this.$eventBus.$on('click-btn-edu', (eventType) => {
      if (eventType === 'add') {
        _this.dlgItem = {}
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
      this.dlgItem.area_code = this.volunteerInfo ? this.volunteerInfo.area_code : null
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
    onPicked (obj) {
      console.log('picked date...', obj.type, obj.date)
      this.dlgItem[obj.type] = obj.date
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.dlgItem = {}
        this.dlgItem.id = this.volunteerEdus.length + 1
        this.dialog = true
        return
      }
      if (!this.selected.id) return alert('교육 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 내역을 삭제하시겠습니까?') && this.deleteItem(this.selected.id)
      else { // update
        this.dlgItem = this.selected
        this.$refs['s_date'].setDate(this.dlgItem.s_date)
        this.$refs['e_date'].setDate(this.dlgItem.e_date)
        this.dialog = true
      }
    },
    async fetchData () {
      this.selected = {}
      !isUndefined(this.v_id) && await this.$store.dispatch(FETCH_VOLUNTEER_EDUS, this.v_id)
      this.fetched = true
    }
  }
}
</script>

<style scoped>
</style>
