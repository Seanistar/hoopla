<template>
  <v-form ref="form">
    <v-container>
      <v-alert class="alert-c" v-model="alert.show" :color="alert.type" :icon="alert.icon" dismissible>
        {{ alert.message }}
      </v-alert>
      <v-layout row wrap>
        <!--첫번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="성명" prepend-icon="mood" :rules="[rules.required]"
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
          <v-text-field label="세례명" prepend-icon="face" :rules="[rules.required]"
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
      </v-layout>

      <v-layout row wrap>
        <!-- 번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="이메일"
                  v-model="params.email" :rules="[rules.email]"
          ></v-text-field><!--prepend-icon="email"-->
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field label="전화번호" persistent-hint
                  v-model="params.phone" mask="### - #### - ####" hint="'-' 없이 입력해주세요."
          ></v-text-field><!--prepend-icon="phone"-->
        </v-flex>
        <!-- 번째 라인-->
        <v-flex xs12>
          <v-text-field label="주소" v-model="params.address"
          ></v-text-field><!--prepend-icon="home"-->
        </v-flex>
        <!-- 번째 라인-->
        <v-flex xs12 sm6>
          <v-text-field label="직업" v-model="params.job"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select label="최종학력" :items="degrees" v-model="params.degree"></v-select>
        </v-flex>

        <v-flex xs12 sm6>
          <v-select label="활동상태" :items="states" item-text="nm" item-value="cd" v-model="params.state"></v-select><!--prepend-icon="contacts"-->
        </v-flex>
        <v-flex xs12 sm6>
          <v-radio-group v-model="params.sex" row>
            <span style="color: rgba(0,0,0,0.54)"><v-icon>wc</v-icon></span>&nbsp;&nbsp;:&nbsp;&nbsp;
           <v-radio label="남자" value="M"></v-radio>
           <v-radio label="여자" value="F"></v-radio>
         </v-radio-group>
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
        <v-textarea label="메모사항"
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
          <v-btn color="orange accent-2" outline class="mb-2" @click="reset" v-if="!isEditMode">초기화</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="submit" ref="submit">{{!isEditMode ? '추가' : '수정'}}</v-btn>
        </div>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import {isEmpty, isUndefined} from 'lodash/lang'
import DatePicker from './control/DatePicker'
import AppAlert from './control/AppAlert'
import {CREATE_VOLUNTEER, UPDATE_VOLUNTEER, FETCH_VOLUNTEER_ITEM} from '@/store/actions.type'
import {VolunteerService} from '@/common/api.service'

export default {
  name: 'VolunteerItem',
  components: { AppAlert, DatePicker },
  props: { v_id: null },
  computed: {
    form () {
      return this.$data.params
    },
    volunteerInfo: {
      get () {
        return this.$store.getters.volunteerInfo(parseInt(this.v_id))
      },
      set (value) {
        this.$store.dispatch(CREATE_VOLUNTEER, value)
      }
    }
  },
  data: () => ({
    isEditMode: false,
    isDisabled: false,
    formHasErrors: false,
    params: { // is equal to bible's column
      sex: 'F',
      state: 'ACT',
      birth_date: null,
      ca_date: null,
      name: null,
      area_code: null,
      la_name: null, // 교구
      ma_name: null, // 본당
      sa_name: null, // 지구
      address: null,
      email: null,
      phone: null,
      job: null,
      degree: null,
      ca_name: null,
      rec_date: null,
      auth_date: null,
      memo: null
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
    states: [{cd: 'ACT', nm: '활동중'}, {cd: 'BRK', nm: '쉼'}, {cd: 'STP', nm: '중단'}, {cd: 'DTH', nm: '사망'}],
    alert: {show: false, message: '초기화 되었습니다.', icon: 'check_circle', type: 'success'},
    la_codes: ['본부', '정릉', '수지', '부산'],
    ma_codes: ['명동', '반포', '흑석', '상암'],
    sa_codes: ['제5구역', '제2구역', '제3구역', '제4구역']
    /* la_codes: [{cd: '01', nm: '본부'}, {cd: '02', nm: '정릉'}, {cd: '03', nm: '수지'}, {cd: '04', nm: '부산'}],
    ma_codes: [{cd: '001', nm: '명동'}, {cd: '002', nm: '반포'}, {cd: '003', nm: '흑석'}, {cd: '004', nm: '상암'}],
    sa_codes: [{cd: '005', nm: '제5구역'}, {cd: '002', nm: '제2구역'}, {cd: '003', nm: '제3구역'}, {cd: '004', nm: '제4구역'}] */
  }),
  created () {
    const _this = this
    this.$eventBus.$on(`close-date-picker-birth_date`, date => (_this.params.birth_date = date))
    this.$eventBus.$on(`close-date-picker-ca_date`, date => (_this.params.ca_date = date))
    this.$eventBus.$on(`close-date-picker-auth_date`, date => (_this.params.auth_date = date))
    this.$eventBus.$on(`close-date-picker-rec_date`, date => (_this.params.rec_date = date))

    this.isEditMode = !isUndefined(this.v_id)
    if (this.isEditMode) this.fetchData()
  },
  methods: {
    async loadItem () {
      let item = null
      if (!isEmpty(this.volunteerInfo)) item = this.volunteerInfo
      else {
        const res = await VolunteerService.get(this.v_id)
        item = res.data[0]
        console.warn('loaded by service...')
      }

      !isEmpty(item) && this.$nextTick(() => {
        Object.keys(item).forEach(k => {
          if (k.indexOf('_date') > 0) {
            this.$refs[k] && this.$refs[k].setDate(item[k])
          }
        })
        this.params = item
        // const [lc, mc, sc] = item.area_code.split('-')
      })
    },
    reset () {
      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        this.$refs[f] !== undefined && this.$refs[f].reset()
        this.$data.params[f] = null
      })
    },
    submit () {
      if (!this.$refs.form.validate()) {
        this.alert = {message: '입력 데이터를 확인해주세요.', icon: 'priority_high', type: 'warning', show: true}
        return
      }

      this.formHasErrors = false
      Object.keys(this.form).forEach(f => {
        console.log(f + ' : ' + this.form[f])
        if (!this.form[f]) this.formHasErrors = true
        // this.$refs[f].validate(true)
      })

      if (!this.isEditMode) {
        this.alert = {message: '추가되었습니다.', icon: 'check_circle', type: 'success', show: true}
        this.$nextTick(() => { this.$refs['submit'].disabled = true })
        this.createItem()
      } else {
        this.$store.dispatch(UPDATE_VOLUNTEER, this.form)
        this.alert = {message: '수정되었습니다.', icon: 'check_circle', type: 'success', show: true}
      }
    },
    async fetchData () {
      await this.$store.dispatch(FETCH_VOLUNTEER_ITEM, this.v_id)
      this.loadItem()
    },
    async createItem () {
      await this.$store.dispatch(CREATE_VOLUNTEER, this.form)
      this.$parent.addDone()
    }
  }
}
</script>

<style scoped>
</style>
