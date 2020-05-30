<template>
  <v-container pt-4 pb-3 px-5 mt-2 elevation-3>
    <v-form ref="form">
      <v-layout pt-3>
        <div class="font-weight-bold black--text subheading">
          <span class="mb-4">기본 정보</span></div>
      </v-layout>
      <v-divider></v-divider>
      <v-container mb-2>
        <v-layout :wrap="$parent.winWidth < 900">
        <v-flex :class="$parent.winWidth < 900 ? 'xs12' : 'xs2'">
          <image-uploader :cid="params.ca_id" :callback="setPhoto">
            <v-progress-circular v-if="isLoading" class="mt-5"></v-progress-circular>
            <template v-else>
              <span class="no-image" v-if="!params.photo">사진 없음</span>
              <img :src="params.photo|url" v-else/>
            </template>
          </image-uploader>
        </v-flex>
        <v-flex :class="$parent.winWidth < 900 ? 'xs12' : 'xs10'" ml-3>
          <v-layout>
            <v-flex xs6>
              <v-combobox label="본당" :value="name.sa"
                          @input="onChangedCode($event)"
                          :items="items" item-value="code" item-text="name"
                          :search-input.sync="search" clearable single-line>
              </v-combobox>
            </v-flex>
            <v-flex xs3 ml-3>
              <v-text-field label="지구" :value="name.ma" disabled></v-text-field>
            </v-flex>
            <v-flex xs3 ml-3>
              <v-text-field label="교구" :value="name.la" disabled></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs4>
              <v-text-field label="봉사자 번호" :rules="[rules.vcode]" mask="##-####"
                            clearable v-model="params.ca_id"></v-text-field>
            </v-flex>
            <v-flex xs4 ml-3>
              <date-picker ref="au_date" title="선서일"
                           @close-date-picker="onPicked" refs="au_date"></date-picker>
            </v-flex>
            <v-flex xs4 ml-3>
              <v-select label="활동 상태" v-model="params.state" :rules="[rules.required]"
                        :items="a_states" item-text="nm" item-value="cd" ></v-select><!--prepend-icon="contacts"-->
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs3>
              <v-text-field label="성명" v-model="params.name" :rules="[rules.name]"
                            :clearable="true" hint="공백없이 실명으로 입력해 주세요."
              ></v-text-field>
            </v-flex>
            <v-flex xs3 ml-3>
              <v-text-field label="세례명" :rules="[rules.required]"
                            clearable v-model="params.ca_name"
              ></v-text-field>
            </v-flex>
            <v-flex xs3 ml-3>
              <!--<date-picker ref="br_date" title="생년월일" @close-date-picker="onPicked" refs="br_date"></date-picker>-->
              <v-text-field label="생년월일" clearable mask="####-##-##" @blur="params.br_date = makeToDate()" v-model="params.br_date"></v-text-field>
            </v-flex>
            <v-flex xs3 ml-3>
              <!--<date-picker ref="ca_date" title="세례일" @close-date-picker="onPicked" refs="ca_date"></date-picker>-->
              <v-text-field label="세례일" clearable mask="####-##-##" @blur="params.ca_date = makeToDate()" v-model="params.ca_date"></v-text-field>
            </v-flex>
          </v-layout>

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
          <v-textarea label="메모" box auto-grow v-model="params.memo"></v-textarea>
        </v-layout>
      </v-container>

      <v-layout mb-1>
        <v-flex xs12 text-xs-right>
          <v-btn color="black accent-2" outline class="mb-2" @click="$router.back()">취소</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="submit" :disabled="isDisabled">저장</v-btn>
          <v-btn color="indigo accent-2" outline class="mb-2" @click="reload" :disabled="!v_id">신규추가</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { isEmpty, isUndefined, isEqual, cloneDeep } from 'lodash/lang'
import { pick } from 'lodash/object'
import { map, find, orderBy } from 'lodash/collection'
import DatePicker from '../control/DatePicker'
import AppAlert from '../control/AppAlert'
import ImageUploader from '../control/ImageUploader'
import { VolunteerService } from '@/common/api.service'
import { ACTIVITY_STATES, LEADER_STATES } from '../../common/const.info'
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
  components: { AppAlert, DatePicker, ImageUploader },
  props: { v_id: undefined },
  computed: {
    ...mapGetters([
      'changedCodes',
      'smallLeader',
      'areaCodes',
      'smallCodes',
      'authInfo'
    ]),
    form () { return this.$data.params },
    volunteerInfo: {
      get () { return this.$store.getters.volunteerInfo(parseInt(this.v_id)) },
      set (value) { this[CREATE_VOLUNTEER](value) }
    }
  },
  data: () => ({
    items: [],
    search: null,
    isEditMode: false,
    isDisabled: false,
    isLeader: false,
    isLoading: false,
    name: { la: '', ma: '', sa: '' },
    params: { // is equal to bible's column
      sex: 'F',
      area_code: '01-01-01',
      ls_date: null,
      ca_date: null,
      l_work: null,
      state: 'ACT',
      photo: null
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
    },
    'params.ca_id' (nid, oid) {
      !oid && nid.length === 6 && console.log('ca id...', nid)
    }
  },
  async created () {
    !this.areaCodes.length && await this.$store.dispatch('fetchAreaCodes')
    this.setCodeInfo()

    this.isEditMode = !isUndefined(this.v_id)
    if (this.isEditMode) this.fetchData()
    else if (this.changedChurchCode) {
      const found = find(this.smallCodes(null), a => {
        return this.changedChurchCode === a.s_code
      })
      if (found) {
        this.name.ma = found.m_name
        this.name.la = found.l_name
        this.name.sa = found.s_name
        this.params.area_code = found.s_code
      }
    }
    // else this.changedCodes.vl_ac && this.assignCode(this.changedCodes.vl_ac)
    // this.params.ca_id = this.authInfo.id
  },
  filters: {
    url (val) {
      return location.origin + val
    }
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
        // console.warn('loaded by service...')
      }
      !isEmpty(item) && this.$nextTick(() => {
        Object.keys(item).forEach(k => {
          if (k.indexOf('_date') > 0) {
            this.$refs[k] && this.$refs[k].setDate(item[k])
          }
        })
        this.initItem(item)
      })
    },
    initItem (item) {
      this.$parent.VOLT = pick(item, ['area_code', 'name', 'ca_name', 'ca_id'])
      if (item.l_work === 'Y') this.isLeader = true
      // this.assignCode(item.area_code)
      const found = find(this.smallCodes(null), a => {
        return item.area_code === a.s_code
      })
      if (found) {
        this.name.ma = found.m_name
        this.name.la = found.l_name
        this.search = this.name.sa = `${found.s_name} (${found.l_name} - ${found.m_name})`
      }
      if (!this.$parent.isAccessible()) this.isDisabled = true
      this.params = item
    },
    onPicked (obj) {
      // console.log('picked date...', obj.type, obj.date)
      this.params[obj.type] = obj.date
    },
    makeToDate () {
      let date = event.target.value
      date = date.replace(/-/g, '')
      if (date.length === 0) return null
      else if (date.length <= 4) return date + '0101'
      else if (date.length <= 6) return date + '01'
      return date === '' ? null : date
    },
    async onChangedCode (info) {
      this.name.la = info ? info.l_name : ''
      this.name.ma = info ? info.m_name : ''
      this.name.sa = info ? info.s_name : ''
      this.params.area_code = info ? info.code : ''

      if (this.v_id === undefined || !this.name.sa) return this.$showSnackBar('본당 정보를 확인해주세요!')
      if (!isEqual(this.volunteerInfo.sa_name, this.name.sa) && confirm('본당 정보를 변경하시겠습니까?')) {
        const history = {
          v_id: this.volunteerInfo.id,
          out_code: this.volunteerInfo.area_code,
          out_name: `${this.volunteerInfo.la_name} 교구 / ${this.volunteerInfo.sa_name} 본당`,
          in_code: this.params.area_code,
          in_name: `${this.name.la} 교구 / ${this.name.sa} 본당`
        }
        await this[CREATE_VOLUNTEER_HISTORY](history)
        this.$showSnackBar('변경되었습니다.')
      }
    },
    async setCodeInfo () {
      const list = map(this.smallCodes(null), o => {
        const msName = `${o.s_name} (${o.l_name} - ${o.m_name})`
        return {code: o.s_code, name: msName, s_name: o.s_name, m_name: o.m_name, l_name: o.l_name}
      })
      this.items = orderBy(list, ['name'])
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
    reload () {
      this.isEditMode = this.isDisabled = this.isLeader = false

      Object.keys(this.form).forEach(f => {
        if (f.indexOf('_date') > 0) this.$refs[f] && this.$refs[f].setDate(null)
        else if (f === 'sex') this.$data.params[f] = 'F'
        else if (f !== 'area_code') this.$data.params[f] = null
      })
      this.$parent.VID = undefined
      this.$parent.VOLT = pick(this.form, ['area_code', 'name', 'ca_name', 'ca_id'])

      setTimeout(() => {
        const path = location.pathname.split('/')
        path.pop()
        const href = location.origin + path.join('/')
        history.replaceState(null, null, href)
      }, 300)
    },
    submit () {
      if (!this.$refs.form.validate()) {
        return alert('입력 데이터를 확인해주세요.')
      }

      if (!this.isEditMode) {
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
        // console.log(vid)
        if (vid < 0) return this.$showSnackBar('봉사자 번호가 중복되었습니다. 다시 확인해주세요.')
        else this.$showSnackBar('추가되었습니다.')
      } catch (e) {
        return alert('실패하였습니다.')
      }

      // this.isDisabled = true
      const targetUrl = `${location.origin}${location.pathname}/${vid}`
      this.$nextTick(() => {
        // console.log('submit...', vid, this.form)
        this.$parent.VID = vid
        this.$parent.VOLT = pick(this.form, ['area_code', 'name', 'ca_name', 'ca_id'])
        history.replaceState(null, null, targetUrl)
      })
    },
    setPhoto (url) {
      this.isLoading = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.params.photo = url
          this.isLoading = false
        })
      }, 1500)
    }
  }
}
</script>

<style scoped>
    .black--text {
      color: #000000 !important;
    }
</style>
