<template>
  <v-container pt-4 pb-3 px-5 mt-2 elevation-3>
    <v-form ref="form">
      <v-layout pt-3>
        <div class="font-weight-bold black--text subheading">
          <span class="mb-4">기본 정보</span></div>
      </v-layout>
      <v-divider></v-divider>
      <v-container mb-4>
        <v-layout>
          <v-flex xs3>
            <v-select label="교구" v-model="areaCode.la_code" @change="onChangeAreaCode"
                      :items="lAreaCodes" item-text="l_name" item-value="l_code"
            ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-select label="지구" v-model="areaCode.ma_code"
                      @change="onChangeAreaCode" no-data-text="지구 자료가 없습니다."
                      :items="mAreaCodes" item-text="m_name" item-value="m_code" :disabled="areaCode.la_code === ''"
            ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-select label="본당" v-model="areaCode.sa_code" :rules="[rules.required]"
                      @change="onChangeAreaCode" no-data-text="본당 자료가 없습니다."
                      :items="sAreaCodes" item-text="s_name" item-value="s_code" :disabled="areaCode.ma_code === ''"
            ></v-select>
          </v-flex>
          <v-flex xs3>
            <v-text-field label="봉사자 번호" :rules="[rules.vcode]" mask="##-####"
                          clearable v-model="params.ca_id"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <v-text-field label="성명" v-model="params.name" :rules="[rules.name]"
                          :clearable="true" hint="공백없이 실명으로 입력해 주세요."
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field label="세례명" :rules="[rules.required]"
                          clearable v-model="params.ca_name"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <date-picker ref="br_date" title="생년월일"
                         @close-date-picker="onPicked" refs="br_date"></date-picker>
          </v-flex>
          <v-flex>
            <date-picker ref="ca_date" title="세례일"
                         @close-date-picker="onPicked" refs="ca_date"></date-picker>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs3>
            <date-picker ref="au_date" title="선서일"
                         @close-date-picker="onPicked" refs="au_date"></date-picker>
          </v-flex>
          <v-flex xs3>
            <v-select label="활동 상태" v-model="params.state" :rules="[rules.required]"
                      :items="a_states" item-text="nm" item-value="cd" ></v-select><!--prepend-icon="contacts"-->
          </v-flex>
        </v-layout>
      </v-container>

      <v-layout>
        <div class="font-weight-bold black--text subheading">대표 봉사자 정보
          <span class="grey--text caption">※ 임기 중이면 종료일은 설정하지 않습니다.</span></div>
      </v-layout>
      <v-divider></v-divider>
      <v-container mb-4>
        <v-layout>
          <v-flex xs2>
            <v-checkbox label="대표 선임" v-model="isLeader" @change="onBeginLeader"
                        :disabled="!this.v_id || params.l_work === 'Y'"></v-checkbox>
          </v-flex>

            <v-flex xs4>
              <date-picker ref="ls_date" title="임기 시작일"
                           @close-date-picker="onPicked" refs="ls_date">
              </date-picker>
            </v-flex>
            <v-flex xs4>
              <date-picker ref="le_date" title="임기 종료일"
                           @close-date-picker="onPicked" refs="le_date"></date-picker>
            </v-flex>
            <v-flex>
              <v-btn color="black accent-2" outline @click="onCompleteLeader('end')"
                     v-if="params.l_work === 'Y' && params.ls_date && params.le_date" class="mt-3">임기 종료</v-btn>
              <v-btn color="grey accent-2"
                     v-else-if="params.l_work === 'Y'" class="mt-3">임기 중</v-btn>
              <v-btn color="black accent-2" outline @click="onCompleteLeader('bgn')"
                     v-else-if="isLeader && !params.l_work && params.ls_date" class="mt-3">임기 시작</v-btn>
            </v-flex>

        </v-layout>
      </v-container>

      <v-layout>
        <div class="font-weight-bold black--text subheading">부가 정보</div>
      </v-layout>
      <v-divider></v-divider>
      <v-container>
        <v-layout row wrap>
          <v-flex xs4>
            <v-text-field label="이메일" v-model="params.email"
            ></v-text-field><!--prepend-icon="email" :rules="[rules.email]"-->
          </v-flex>
          <v-flex xs4>
            <v-text-field label="전화번호" persistent-hint
                          v-model="params.phone" mask="### - #### - ####" hint="'-' 없이 입력해주세요."
            ></v-text-field><!--prepend-icon="phone"-->
          </v-flex>
          <v-flex xs4>
            <v-radio-group v-model="params.sex" row>
              <span style="color: rgba(0,0,0,0.54)"><v-icon>wc</v-icon></span>&nbsp;&nbsp;:&nbsp;&nbsp;
              <v-radio label="남자" value="M"></v-radio>
              <v-radio label="여자" value="F"></v-radio>
            </v-radio-group>
          </v-flex>

          <v-flex xs12>
            <v-text-field label="주소" v-model="params.address"></v-text-field><!--prepend-icon="home"-->
          </v-flex>

          <v-flex xs6>
            <v-text-field label="직업" v-model="params.job"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-select label="최종학력" :items="degrees" v-model="params.degree"></v-select>
          </v-flex>
        </v-layout>

        <v-layout pt-2>
          <v-textarea label="메모사항" box auto-grow v-model="params.memo"></v-textarea>
        </v-layout>
      </v-container>

      <v-layout justify-end mb-1>
        <div>
          <v-btn color="black accent-2" outline class="mb-2" @click="$router.back()">취소</v-btn>
        </div>
        <div>
          <v-btn color="orange accent-2" outline class="mb-2" @click="reset" v-if="false">초기화</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="submit" :disabled="isDisabled">{{!isEditMode ? '추가' : '수정'}}</v-btn>
        </div>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { isEmpty, isUndefined, isEqual, cloneDeep } from 'lodash/lang'
import { pick } from 'lodash/object'
import DatePicker from './control/DatePicker'
import AppAlert from './control/AppAlert'
import { VolunteerService } from '@/common/api.service'
import { ACTIVITY_STATES, LEADER_STATES } from '../common/const.info'
import CodeMixin from '@/common/code.mixin'
import { mapActions, mapGetters } from 'vuex'
import {
  CREATE_VOLUNTEER,
  UPDATE_VOLUNTEER,
  FETCH_VOLUNTEER_ITEM,
  BEGIN_VOLUNTEER_LEADER,
  END_VOLUNTEER_LEADER,
  CREATE_VOLUNTEER_HISTORY
} from '@/store/actions.type'

export default {
  name: 'VolunteerItem',
  mixins: [ CodeMixin ],
  components: { AppAlert, DatePicker },
  props: { v_id: undefined },
  computed: {
    ...mapGetters([
      'changedCodes',
      'smallLeader',
      'authInfo'
    ]),
    form () { return this.$data.params },
    volunteerInfo: {
      get () { return this.$store.getters.volunteerInfo(parseInt(this.v_id)) },
      set (value) { this[CREATE_VOLUNTEER](value) }
    }
  },
  data: () => ({
    isEditMode: false,
    isDisabled: false,
    isLeader: false,
    params: { // is equal to bible's column
      sex: 'F',
      area_code: '01-01-01',
      ls_date: null,
      l_work: null,
      state: {cd: 'ACT', nm: '활동중'}
    },
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
      },
      vcode: val => {
        const pattern = /(\d{2})(\d{4})/
        return (pattern.test(val) && val.length === 6) || '6자리 입력이 필요합니다.'
      },
      name: val => (val && val.search(' ') < 0) || '이름은 공란없이 작성해주세요.'
    },
    degrees: ['초졸', '중졸', '고졸', '초대졸', '대졸', '대학원졸'],
    l_states: LEADER_STATES,
    a_states: ACTIVITY_STATES
  }),
  watch: {
    'params.le_date' (date) {
      if (!date || !this.params.ls_date) return
      if (this.params.ls_date > date) {
        this.$nextTick(() => {
          this.$refs['le_date'].setDate(this.params.le_date = null)
        })
        return alert('종료일이 시작일보다 빠릅니다.')
      }
    }
  },
  created () {
    this.isEditMode = !isUndefined(this.v_id)
    if (this.isEditMode) this.fetchData()
    else this.changedCodes.vl_ac && this.assignCode(this.changedCodes.vl_ac)
    // this.params.ca_id = this.authInfo.id
  },
  mounted () {
    /* const ts = document.getElementsByTagName('INPUT')
    for (let i = 0; i < ts.length; i++) {
      ts[i].addEventListener('change', () => {
        console.log('changed input...', ts[i].nodeValue)
      })
    } */
  },
  methods: {
    ...mapActions([
      FETCH_VOLUNTEER_ITEM,
      CREATE_VOLUNTEER,
      UPDATE_VOLUNTEER,
      BEGIN_VOLUNTEER_LEADER,
      END_VOLUNTEER_LEADER,
      CREATE_VOLUNTEER_HISTORY
    ]),
    async fetchData () {
      await this[FETCH_VOLUNTEER_ITEM](this.v_id)
      this.loadItem()
    },
    async loadItem () {
      let item = null
      if (!isEmpty(this.volunteerInfo)) item = cloneDeep(this.volunteerInfo)
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
          /* if (k === 'ca_id') {
            let cd = item['area_code']
            item[k] = `${this.authInfo.id}${cd.replace(/-/g, '')}${item['ca_id']}`
          } */
        })
        this.initItem(item)
      })
    },
    initItem (item) {
      this.$parent.VOLT = pick(item, ['area_code', 'name', 'ca_name', 'ca_id'])
      if (item.l_work === 'Y') this.isLeader = true
      this.assignCode(item.area_code)

      if (!this.$parent.isAccessible()) this.isDisabled = true
      this.params = item
    },
    onPicked (obj) {
      console.log('picked date...', obj.type, obj.date)
      this.params[obj.type] = obj.date
    },
    async onChangeAreaCode () {
      if (this.v_id === undefined || !this.params.sa_name) return
      if (!isEqual(this.volunteerInfo.sa_name, this.params.sa_name) && confirm('본당 정보를 변경하시겠습니까?')) {
        const history = {
          v_id: this.volunteerInfo.id,
          out_code: this.volunteerInfo.area_code,
          out_name: `${this.volunteerInfo.la_name} 교구 / ${this.volunteerInfo.sa_name} 본당`,
          in_code: this.params.area_code,
          in_name: `${this.params.la_name} 교구 / ${this.params.sa_name} 본당`
        }
        await this[CREATE_VOLUNTEER_HISTORY](history)
        this.$showSnackBar('변경되었습니다.')
      }
    },
    async onCompleteLeader (type) {
      if (!this.v_id) return alert('봉사자 정보를 먼저 추가해주세요.')
      if (type === 'end') {
        if (confirm('임기를 종료하시겠습니까? 변경 후 수정할 수 없습니다.')) {
          await this[END_VOLUNTEER_LEADER](pick(this.params, ['id', 'ls_date', 'le_date']))
          this.$showSnackBar('종료되었습니다.')
          this.$nextTick(() => {
            this.isLeader = false
            this.params.l_work = 'N'
            this.params.ls_date = this.params.le_date = null
          })
        }
      } else {
        if (this.params.l_work) return // must be undefined
        if (confirm('임기를 시작하시겠습니까?')) {
          await this[BEGIN_VOLUNTEER_LEADER](pick(this.params, ['id', 'area_code', 'ls_date']))
          this.$showSnackBar('시작되었습니다.')
          this.$nextTick(() => {
            this.params.l_work = 'Y'
          })
        }
      }
    },
    onBeginLeader () {
      if (this.isLeader && this.smallLeader.lv_id) {
        alert('이미 대표자가 임기 중입니다!')
        this.$nextTick(() => {
          this.isLeader = false
        })
      }
    },
    reset () {
      Object.keys(this.form).forEach(f => {
        this.$refs[f] !== undefined && this.$refs[f].reset()
        this.$data.params[f] = null
      })
    },
    submit () {
      if (!this.$refs.form.validate()) {
        return alert('입력 데이터를 확인해주세요.')
      }

      /* Object.keys(this.form).forEach(f => {
        let obj = this.form[f]
        if (obj && f === 'ca_id') this.params.ca_id = obj.substr(8)
        console.log(obj)
      }) */

      // console.log(this.form)
      if (!this.isEditMode) {
        this.isDisabled = true
        this.createItem()
      } else {
        this[UPDATE_VOLUNTEER](this.form)
        this.$showSnackBar('수정되었습니다.')
      }
    },
    async createItem () {
      let vid = null
      try {
        vid = await this[CREATE_VOLUNTEER](this.form)
        this.$showSnackBar('추가되었습니다.')
      } catch (e) {
        console.warn(e)
        return alert('실패하였습니다.')
      }

      // const targetUrl = `${location.origin}${location.pathname}/${vid}`
      this.$nextTick(() => {
        // location.replace(targetUrl)
        console.log('submit...', vid, this.form)
        this.$parent.VID = vid
        this.$parent.VOLT = pick(this.form, ['area_code', 'name', 'ca_name', 'ca_id'])
      })
    }
    /* onChangedCode (type, nv, ov) {
      let target = ''
      if (type === 's') {
        target = nv ? nv.replace(/-/g, '') : this.areaCode.ma_code
      } else if (type === 'm') {
        target = nv ? nv.replace(/-/g, '') : this.areaCode.la_code
      } else if (type === 'l') {
        target = nv && nv.replace(/-/g, '')
        ov && nv && (this.areaCode.ma_code = this.areaCode.sa_code = '')
      }

      if (ov && nv) {
        let obj = this.$parent.VOLT
        this.params.ca_id = `${this.authInfo.id}${target}${obj['ca_id'].substr(8)}`
      }
    } */
  }
}
</script>

<style scoped>
    .black--text {
      color: #000000 !important;
    }
</style>
