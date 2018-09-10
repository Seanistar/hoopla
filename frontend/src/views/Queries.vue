<template>
  <div class="pt-4">
    <v-form ref="form">
      <v-container style="width: 85%" class="elevation-2">
        <v-layout row wrap pl-2>
          <v-flex xs12 sm3>
            <v-select label="교구이름" v-model="areaCode.la_code" hide-details
                      :items="lAreaCodes" item-text="l_name" item-value="l_code"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select label="지구이름" v-model="areaCode.ma_code" hide-details no-data-text="본당 자료가 없습니다."
                      :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select label="본당이름" v-model="areaCode.sa_code" hide-details no-data-text="지구 자료가 없습니다."
                      :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row wrap pl-2>
          <!--<v-flex xs12 sm3>
            <v-select label="그룹공부" v-model="params.group_edu" hide-details chips multiple
                      :items="eduCodes" item-text="name" item-value="code"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm3>
            <v-select label="그룹봉사" v-model="params.group_vlt" hide-details chips multiple
                      :items="eduCodes" item-text="name" item-value="code"
            ></v-select>
          </v-flex>-->
          <v-flex xs3>
            <v-select label="선서연도" v-model="params.au_date" hide-details
                      :items="years"
            ></v-select>
          </v-flex>
          <v-flex xs9>
            <v-layout align-center justify-end row>
              <!--<v-btn color="green accent-2" outline class="mb-2" @click="churchFinder = true">성당찾기</v-btn>
              <v-btn color="green accent-2" outline class="mb-2" @click="peopleFinder = true">사람찾기</v-btn>-->
              <v-btn color="orange accent-2" outline class="mb-2" @click="reset">초기화</v-btn>
              <v-btn color="indigo accent-2" outline class="mb-2" @click="submit">조회</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>

    <v-divider class="my-3"></v-divider>
    <v-container class="elevation-4" style="width: 85%">
      <v-layout>
        <v-flex xs12 pb-2>
          조회 결과 수 : {{queryCount}} 건
        </v-flex>
      </v-layout>
      <v-progress-circular class="progressing" :size="50" color="primary"
                           :indeterminate="isVolunteersLoading" v-show="queried && isVolunteersLoading"
      ></v-progress-circular>
        <v-data-table :headers="headers" :items="queryVolunteers" hide-actions no-data-text="조회 조건을 선택하세요."
        >
          <template slot="items" slot-scope="props">
            <tr @click="onSelectResult(props.item)" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
              <td class="text-xs-center">{{ props.item.id }}</td>
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.ca_name }}</td>
              <td class="text-xs-center">{{ props.item.au_date|yearstamp }}</td>
              <td class="text-xs-center">{{ props.item.la_name }}</td>
              <td class="text-xs-center">{{ props.item.ma_name }}</td>
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
    <people-dialog :visible="peopleFinder" @close-find-people="onPeopleFind"/>
    <church-dialog :visible="churchFinder" @close-find-church="onChurchFind"/>
  </div>
</template>

<script>
import DatePicker from '@/components/control/DatePicker'
import { QUERY_VOLUNTEERS } from '@/store/actions.type'
import { SET_QUERY_INFO } from '@/store/mutations.type'
import { mapGetters } from 'vuex'
import CodeMixin from '@/common/code.mixin'
import PeopleDialog from '@/components/control/FindPeopleDialog'
import ChurchDialog from '@/components/control/FindChurchDialog'
import { range } from 'lodash/util'

export default {
  name: 'QueryVolunteer',
  mixins: [ CodeMixin ],
  components: { DatePicker, PeopleDialog, ChurchDialog },
  computed: {
    ...mapGetters([
      'eduCodes',
      'isVolunteersLoading',
      'queryInfo',
      'queryCount',
      'queryVolunteers'
    ]),
    formData () {
      return {
        a_code: this.params.area_code,
        au_date: this.params.au_date
      }
    },
    years () {
      const start = (new Date()).getFullYear()
      return range(start, 1972, -1)
    }
  },
  data: () => ({
    queried: false,
    selected: {},
    peopleFinder: false,
    churchFinder: false,
    params: { // is equal to bible's column
      sex: 'F',
      state: 'ACT',
      ca_date: null,
      au_date: null,
      group_edu: null,
      group_vlt: null,
      note_done: null,
      bible_exe: null,
      bible_40_read: null,
      bible_40_deep: null
    },
    headers: [
      { text: 'ID', value: 'id', align: 'center' },
      { text: '성명', value: 'name', align: 'center' },
      { text: '세례명', value: 'caName', align: 'center' },
      { text: '선서일', value: 'saName', align: 'center' },
      { text: '교구명', value: 'laName', align: 'center' },
      { text: '지구명', value: 'maName', align: 'center' },
      { text: '본당명', value: 'saName', align: 'center' },
      { text: '그룹공부 횟수', value: 'eduCount', align: 'center' },
      { text: '그룹봉사 횟수', value: 'actCount', align: 'center' }
    ]
  }),
  methods: {
    reset () {
      this.resetCode()
      this.params.au_date = null
      this.params.group_edu = this.params.group_vlt = null
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
    onSelectResult (item) {
      this.selected = item
      this.$store.commit(SET_QUERY_INFO, {cond: this.formData, good: item})
      this.$router.push({name: 'view-query'})
    },
    onPeopleFind (data) {
      console.log('found people...', data)
      this.peopleFinder = false
    },
    onChurchFind (data) {
      console.log('found church...', data)
      this.churchFinder = false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.selected = vm.queryInfo.good
      vm.params = vm.queryInfo.cond
    })
  }
}
</script>

<style scoped>
</style>
