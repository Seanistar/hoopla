<template>
  <v-form ref="form">
    <v-container>
      <v-layout row wrap>
        <!--첫번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="성명" :rules="[rules.required]"
                  :clearable="true" v-model="params.name"
                  hint="실명으로 입력해 주세요."
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <date-picker ref="birth_date" refs="birth_date" title="생년월일"
          ></date-picker>
        </v-flex>
        <!--두번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="세례명" :rules="[rules.required]"
                        clearable v-model="params.ca_name"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <date-picker ref="ca_date" refs="ca_date" title="세례일"
          ></date-picker>
        </v-flex>
      </v-layout>

      <!--세번째 라인-->
      <v-layout wrap>
        <v-flex xs12 sm4 d-flex>
          <v-select label="교구코드"
            :items="items" v-model="params.la_code"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4 d-flex>
          <v-select label="본당코드" ref="ma_code"
            :items="items" v-model="params.ma_code" :disabled="params.la_code === null"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm4 d-flex>
          <v-select label="지구코드" ref="sa_code"
            :items="items" v-model="params.sa_code" :disabled="params.ma_code === null"
          ></v-select>
        </v-flex>
      </v-layout>

      <!--네번째 라인-->
      <!--<v-layout row wrap>
        <v-flex xs12 sm6>
          <v-radio-group v-model="params.sex" row>
            <v-radio label="남자" value="m"></v-radio>
            <v-radio label="여자" value="f"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>-->

      <v-layout row wrap>
        <!-- 번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="이메일"
                  v-model="params.email"
                  :rules="[rules.email]"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field label="전화번호"
                  v-model="params.phone"
                  mask="### - #### - ####"
                  hint="'-' 없이 입력해주세요."
                  persistent-hint
          ></v-text-field>
        </v-flex>
        <!-- 번째 라인-->
        <v-flex xs12>
          <v-text-field label="주소" v-model="params.address"
          ></v-text-field>
        </v-flex>
        <!-- 번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="직업" v-model="params.job"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <!--<v-text-field label="최종학력" v-model="params.degree"></v-text-field>-->
          <v-select label="최종학력" :items="degrees" v-model="params.degree"></v-select>
        </v-flex>
        <!-- 번째 라인-->
        <v-flex xs12 sm6>
          <date-picker ref="auth_date" refs="auth_date" title="선서일"
          ></date-picker>
        </v-flex>
        <v-flex xs12 sm6>
          <date-picker ref="rec_date" refs="rec_date" title="기록일"
          ></date-picker>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="tp-20">
        <v-textarea label="메모 사항"
          box auto-grow
          v-model="params.memo"
        ></v-textarea>
      </v-layout>

      <v-divider class="tm-10 bm-10"></v-divider>
      <v-layout class="fl-r">
        <div>
          <v-btn color="black accent-2" outline class="mb-2" @click="$router.back()">취소</v-btn>
        </div>
        <div>
          <v-btn color="orange accent-2" outline class="mb-2" @click="reset">초기화</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="submit">{{textForm}}</v-btn>
        </div>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { isEmpty } from 'lodash/lang'
import Moment from 'moment'
import DatePicker from './DatePicker'
import { CREATE_VOLUNTEER, UPDATE_VOLUNTEER } from '@/store/actions.type'

export default {
  name: 'VolunteerItem',
  props: {
    volt: { type: Object, default: () => {} }
  },
  components: { DatePicker },
  computed: {
    form () {
      return this.$data.params
    },
    textForm () {
      return isEmpty(this.volt) ? '추가 완료' : '수정 완료'
    },
    volunteerInfo: {
      get () {
        return this.$store.state.volunteer.volunteerInfo
      },
      set (value) {
        this.$store.dispatch(CREATE_VOLUNTEER, value)
      }
    }
  },
  data: () => ({
    formHasErrors: false,
    params: { // is equal to bible's column
      sex: 'f',
      birth_date: null,
      ca_date: null,
      name: null,
      la_code: null, // 교구코드
      ma_code: null, // 본당코드
      sa_code: null, // 지구코드
      address: null,
      email: null,
      phone: null,
      job: null,
      degree: null,
      ca_name: null,
      rec_date: null,
      auth_date: null,
      memo: '찬미 예수! 주님과 함께하시게됨을 축하드립니다.'
    },
    title: [
      { text: '봉사자 기본 정보', link: '' },
      { text: '봉사자 교육 현황', link: '' },
      { text: '봉사자 활동 내역', link: '' }
    ],
    rules: {
      required: value => !!value || '필수 항목입니다.',
      counter: value => value.length <= 20 || '최대 20자까지 가능합니다.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '잘못된 형식입니다.'
      },
      phone: value => {
        const pattern = /(\d{3})(\d{4})(\d{4})/
        return pattern.test(value) || '잘못된 형식입니다.'
      }
      // name: v => v.length <= 10 || 'Name must be less than 10 characters'
    },
    degrees: ['초졸', '중졸', '고졸', '초대졸', '대졸'],
    items: ['01', '02', '03', '04', '05']
  }),
  created () {
    this.$eventBus.$on('close-date-picker', (obj) => {
      console.info(obj.refs, this.$data.params[obj.refs] = obj.date)
    })
    !isEmpty(this.volt) && this.$nextTick(() => {
      Object.keys(this.volt).forEach(k => {
        const pos = k.indexOf('_date')
        if (pos > 0) {
          this.$refs[k].date = this.volt[k] = this.date(this.volt[k])
        }
      })
      this.params = this.volt
      // console.log(this.params)
    })
  },
  methods: {
    reset () {
      this.formHasErrors = false

      Object.keys(this.form).forEach(f => {
        this.$refs[f] !== undefined && this.$refs[f].reset()
        this.$data.params[f] = null
      })
    },
    submit () {
      if (!this.$refs.form.validate()) {
        alert('입력된 데이터를 다시 확인해주세요.')
        return
      }

      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        console.log(f + ' : ' + this.form[f])
        if (!this.form[f]) this.formHasErrors = true
        // this.$refs[f].validate(true)
      })

      if (isEmpty(this.volt)) {
        this.$store.dispatch(CREATE_VOLUNTEER, this.form)
        setTimeout(() => {
          this.$router.push({name: 'volunteers'})
        }, 300)
      } else {
        this.$store.dispatch(UPDATE_VOLUNTEER, this.form)
        confirm('수정되었습니다. 리스트로 이동하시겠습니까?') && this.$router.push({name: 'volunteers'})
      }
    },
    date (val) {
      return val !== null ? Moment(val).format('YYYY-MM-DD') : '0000-00-00'
    }
  }
}
</script>

<style scoped>
</style>
