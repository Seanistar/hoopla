<template>
  <div class="tp-10">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">봉사 활동 내역</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <date-picker ref="s_date" refs="act-s_date" title="봉사활동 시작일"
                  ></date-picker>
                </v-flex>
                <v-flex xs12 sm6>
                  <date-picker ref="e_date" refs="act-e_date" title="봉사활동 종료일"
                  ></date-picker>
                </v-flex>
                <v-flex xs12>
                  <v-select label="봉사 단체" v-model="dlgItem.grp_code"
                            :items="groupObjects" item-text="name" item-value="code"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="dlgItem.content" label="봉사 활동"></v-text-field>
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
    <v-data-table :headers="headers" :items="volunteerActs" hide-actions class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ getGroupName(parseInt(props.item.grp_code)) }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
          <td class="text-xs-center">{{ props.item.e_date }}</td>
          <td class="text-xs-center">{{ props.item.area_code }}</td>
          <td class="text-xs-center">{{ props.item.content }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          봉사 활동 내역이 없습니다.
        </v-alert>
      </template>
    </v-data-table>
    <inline-buttons refs="act"/>
  </div>
</template>

<script>
import InlineButtons from './control/InlineButtons'
import DatePicker from './control/DatePicker'
import {isEmpty, isUndefined} from 'lodash/lang'
import {find} from 'lodash/collection'
import {FETCH_VOLUNTEER_ACTS, CREATE_VOLUNTEER_ACT, UPDATE_VOLUNTEER_ACT, DELETE_VOLUNTEER_ACT} from '../store/actions.type'

const DEFALUT_ITEM = {id: null, s_date: '', e_date: '', grp_code: null, gv_ids: '', content: ''}
export default {
  name: 'VolunteerActs',
  components: { DatePicker, InlineButtons },
  props: { v_id: null },
  computed: {
    volunteerActs: {
      get () {
        return this.$store.state.volunteer.volunteerActs
      },
      set (data) {
        this.$store.dispatch(CREATE_VOLUNTEER_ACT, data)
      }
    },
    groupObjects () {
      return this.$store.getters.eduCodes
    }
  },
  data: () => ({
    selected: {},
    dialog: false,
    dlgItem: {},
    headers: [
      { text: '번호', align: 'center', value: 'id' },
      { text: '봉사 단체', align: 'center', value: 'grp_name' },
      { text: '활동 시작일', align: 'center', value: 's_date' },
      { text: '활동 종료일', align: 'center', value: 'e_date' },
      { text: '구역코드', align: 'center', value: 'area_code', sortable: false },
      { text: '활동내용', align: 'center', value: 'content', sortable: false }
    ]
  }),
  created () {
    this.fetchData()

    const _this = this
    this.$eventBus.$on('close-date-picker-act-s_date', (date) => {
      _this.dlgItem.s_date = date
    })
    this.$eventBus.$on('close-date-picker-act-e_date', (date) => {
      _this.dlgItem.e_date = date // TODO: check it that s_date must be previous e_date
    })
    this.$eventBus.$on('click-btn-act', (eventType) => {
      if (eventType === 'add') {
        _this.dlgItem = DEFALUT_ITEM
        _this.dlgItem.id = _this.volunteerActs.length + 1
      } else if (eventType === 'remove') {
        if (isEmpty(_this.selected)) return alert('내역을 선택해주세요.')
        return confirm('선택 항목을 삭제하시겠습니까?') && _this.deleteActItem(_this.selected.id)
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
        this.dlgItem.grp_name = this.getGroupName(this.dlgItem.grp_code)
        this.volunteerActs = this.dlgItem
      } else {
        this.updateActItem(this.dlgItem)
      }
    },
    updateActItem (item) {
      this.$store.dispatch(UPDATE_VOLUNTEER_ACT, item)
    },
    deleteActItem (id) {
      this.$store.dispatch(DELETE_VOLUNTEER_ACT, id)
    },
    async fetchData () {
      this.selected = {}
      if (isUndefined(this.v_id)) return
      await this.$store.dispatch(FETCH_VOLUNTEER_ACTS, this.v_id)
    },
    getGroupName (code) {
      const obj = find(this.groupObjects, (g) => g.code === code)
      return !isEmpty(obj) ? obj.name : ''
    }
  }
}
</script>

<style scoped>
</style>
