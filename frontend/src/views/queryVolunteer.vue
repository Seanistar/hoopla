<template>
  <div class="tp-20">
    <v-form ref="form">
      <v-container style="width: 75%;">
        <v-layout row wrap class="tm-10" style="border: 3px solid silver; padding: 0 15px 15px 15px">
          <v-flex xs12 sm4 d-flex>
            <v-select label="교구코드"
                      :items="la_codes" v-model="params.la_name"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="본당코드" ref="ma_name"
                      :items="ma_codes" v-model="params.ma_name" :disabled="params.la_name === null"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm4 d-flex>
            <v-select label="지구코드" ref="sa_name"
                      :items="sa_codes" v-model="params.sa_name" :disabled="params.ma_name === null"
            ></v-select>
          </v-flex>

          <v-flex xs12 sm6>
            <v-select v-model="params.group_edu" :items="groupObjects" item-text="name" item-value="code"
              chips label="그룹공부" multiple
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select v-model="params.group_vlt" :items="groupObjects" item-text="name" item-value="code"
              chips label="그룹봉사" multiple
            ></v-select>
          </v-flex>

          <v-flex xs12>
            <v-layout align-center justify-end row>
              <v-btn color="orange accent-2" outline class="mb-2" @click="reset" justify-end>초기화</v-btn>
              <v-btn color="indigo accent-2" outline class="mb-2" @click="submit" justify-end>조회</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>

        <!--<v-layout row wrap>
          <v-flex xs12 sm6>
            <v-radio-group v-model="params.sex" row>
              <span style="color: rgba(0,0,0,0.54)"><v-icon>wc</v-icon></span>&nbsp;&nbsp;:&nbsp;&nbsp;
              <v-radio label="남자" value="M"></v-radio>
              <v-radio label="여자" value="F"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12>
            그룹공부, 그룹봉사, 성서연수, 노트검사, 성서사십주간-읽기안내, 성서사십주간-심화
          </v-flex>
          <v-flex xs12 sm6>
            <date-picker ref="birth_date" refs="birth_date" title="생년월일"
            ></date-picker>
          </v-flex>
          <v-flex xs12 sm6>
            <date-picker ref="ca_date" refs="ca_date" title="세례일"
            ></date-picker>
          </v-flex>
          <v-flex xs12 sm6>
            <date-picker ref="auth_date" refs="auth_date" title="선서일"
            ></date-picker>
          </v-flex>
        </v-layout>-->
      </v-container>
    </v-form>

    <v-divider class="my-3"></v-divider>
    <v-container class="elevation-1" style="width: 80%">
        <v-data-table :headers="headers" :items="queries" hide-actions
        >
          <template slot="items" slot-scope="props">
            <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
              <td class="text-xs-center">{{ props.item.id }}</td>
              <td class="text-xs-center">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.ca_name }}</td>
              <td class="text-xs-center">{{ props.item.admin_id }}</td>
              <td class="text-xs-center">{{ props.item.registered }}</td>
              <td class="text-xs-left">{{ props.item.area_code }}</td>
            </tr>
          </template>
          <template slot="no-data" v-if="fetched">
            결과 내역이 없습니다.
          </template>
        </v-data-table>
    </v-container>
  </div>
</template>

<script>
import DatePicker from '@/components/control/DatePicker'

export default {
  name: 'QueryVoluneteer',
  components: { DatePicker },
  computed: {
    groupObjects () {
      return this.$store.getters.eduCodes
    }
  },
  data: () => ({
    fetched: false,
    selected: {},
    params: { // is equal to bible's column
      sex: 'F',
      state: 'ACT',
      ca_date: null,
      area_code: null,
      la_code: null, // 교구
      ma_code: null, // 본당
      sa_code: null, // 지구
      group_edu: null,
      group_vlt: null,
      note_done: null,
      bible_exe: null,
      bible_40_read: null,
      bible_40_deep: null
    },
    la_codes: [],
    ma_codes: [],
    sa_codes: [],
    queries: [
      {id: 123, admin_id: '은총', area_code: '01-002-003', name: '김성휘', ca_name: '베드로', registered: '2018-09-04'},
      {id: 456, admin_id: '봉사', area_code: '02-004-012', name: '강하나', ca_name: '소피아', registered: '2018-09-17'},
      {id: 789, admin_id: '소명', area_code: '01-024-002', name: '서예지', ca_name: '요세피나', registered: '2018-08-15'},
      {id: 1592, admin_id: 'bible', area_code: '01-014-001', name: '김효진', ca_name: '유스티나', registered: '2018-08-03'},
      {id: 2154, admin_id: 'bibleClass', area_code: '01-015-002', name: '최우빈', ca_name: '베네딕토', registered: '2018-07-19'}
    ],
    headers: [
      { text: 'ID', value: 'id', align: 'center' },
      { text: '성명', value: 'name', align: 'center' },
      { text: '세례명', value: 'caName', align: 'center', sortable: false },
      { text: '관리자', value: 'admin', align: 'center' },
      { text: '등록일', value: 'regDate', align: 'center' },
      { text: '구역코드', value: 'areaCode', align: 'center' }
    ]
  }),
  methods: {
    reset () {},
    submit () {}
  }
}
</script>

<style scoped>
</style>
