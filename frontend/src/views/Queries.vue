<template>
  <div class="pt-4">
    <v-form ref="form">
      <v-container style="width: 85%">
        <v-layout row wrap class="tm-10" style="border: 3px solid silver; padding: 15px">
          <v-flex xs12 sm4 d-flex>
            <v-select label="교구코드" v-model="areaCode.la_code"
                      :items="lAreaCodes" item-text="l_name" item-value="l_code"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="본당코드" v-model="areaCode.ma_code" no-data-text="본당 자료가 없습니다."
                      :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="지구코드" v-model="areaCode.sa_code" no-data-text="지구 자료가 없습니다."
                      :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
            ></v-select>
          </v-flex>

          <v-flex xs12 sm6>
            <v-select label="그룹공부" v-model="params.group_edu" chips multiple
                      :items="eduCodes" item-text="name" item-value="code"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select label="그룹봉사" v-model="params.group_vlt" chips multiple
                      :items="eduCodes" item-text="name" item-value="code"
            ></v-select>
          </v-flex>

          <v-flex xs12>
            <v-layout align-center justify-end row>
              <v-btn color="green accent-2" outline class="mb-2" @click="churchFinder = true">성당찾기</v-btn>
              <v-btn color="green accent-2" outline class="mb-2" @click="peopleFinder = true">사람찾기</v-btn>
              <v-btn color="orange accent-2" outline class="mb-2" @click="reset">초기화</v-btn>
              <v-btn color="indigo accent-2" outline class="mb-2" @click="submit">조회</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>

    <v-divider class="my-3"></v-divider>
    <v-container class="elevation-1" style="width: 80%">
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
            <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
              <td class="text-xs-center">{{ props.item.id }}</td>
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.ca_name }}</td>
              <td class="text-xs-center">{{ props.item.sex === 'F' ? '여성' : '남성'}}</td>
              <td class="text-xs-center">{{ props.item.la_name }}</td>
              <td class="text-xs-center">{{ props.item.ma_name }}</td>
              <td class="text-xs-center">{{ props.item.sa_name }}</td>
              <td class="text-xs-center">{{ props.item.job }}</td>
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
import { mapGetters } from 'vuex'
import CodeMixin from '@/common/code.mixin'
import PeopleDialog from '@/components/control/FindPeopleDialog'
import ChurchDialog from '@/components/control/FindChurchDialog'

export default {
  name: 'QueryVolunteer',
  mixins: [ CodeMixin ],
  components: { DatePicker, PeopleDialog, ChurchDialog },
  computed: {
    ...mapGetters([
      'eduCodes',
      'isVolunteersLoading',
      'queryCount',
      'queryVolunteers'
    ])
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
      { text: '성별', value: 'sex', align: 'center' },
      { text: '교구명', value: 'laName', align: 'center' },
      { text: '본당명', value: 'maName', align: 'center' },
      { text: '지구명', value: 'saName', align: 'center' },
      { text: '직업', value: 'job', align: 'center' },
      { text: '그룹공부 횟수', value: 'eduCount', align: 'center' },
      { text: '그룹봉사 횟수', value: 'actCount', align: 'center' }
    ]
  }),
  methods: {
    reset () {
      this.resetCode()
      this.params.group_edu = this.params.group_vlt = null
    },
    submit () {
      if (!this.params.area_code) return alert('검색할 구역코드를 설정하세요.')

      this.$store.dispatch(QUERY_VOLUNTEERS, {a_code: this.params.area_code})
      this.queried = true
    },
    onPeopleFind (data) {
      console.log('found people...', data)
      this.peopleFinder = false
    },
    onChurchFind (data) {
      console.log('found church...', data)
      this.churchFinder = false
    }
  }
}
</script>

<style scoped>
</style>
