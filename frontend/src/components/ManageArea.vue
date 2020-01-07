<template>
  <v-container class="elevation-2 mt-3 pt-1">
    <v-layout row align-baseline>
      <v-flex xs12 sm4>
        <v-text-field label="편집할 구역을 선택하세요." class="py-0 body-1"
                      readonly single-line :value="codeName"></v-text-field>
      </v-flex>
      <v-flex xs12 sm2 offset-sm6>
        <menu-buttons refs="codes" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm4 d-flex @click="selected = 'L'">
        <v-card :raised="selected === 'L'">
          <v-list>
            <v-subheader key="header" class="text-xs-center" :class="selected === 'L' ? 'active-card' : ''">
              <span class="full-width">교구 코드</span>
            </v-subheader>
            <v-radio-group v-model="areaCode.la_code" mandatory class="pl-2">
              <template v-for="(item, index) in _l_codes()" v-if="item.l_code !== ''">
                <v-list-tile :key="item.l_code + index" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.l_code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.l_name }} ({{ item.l_code|areaCode(0, 2) }})</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 d-flex class="ml-3" @click="selected = 'M'">
        <v-card :raised="selected === 'M'">
          <v-list>
            <v-subheader key="header" class="text-xs-center" :class="selected === 'M' ? 'active-card' : ''">
              <span class="full-width">지구 코드</span>
            </v-subheader>
            <v-radio-group v-model="areaCode.ma_code" class="pl-2" v-if="areaCode.la_code !== ''">
              <template v-for="(item, index) in _m_codes()" v-if="item.m_code !== ''">
                <v-list-tile :key="item.m_code + index" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.m_code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.m_name }} ({{ item.m_code|areaCode(3, 5) }})</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 d-flex class="ml-3" @click="selected = 'S'">
        <v-card :raised="selected === 'S'">
          <v-list >
            <v-subheader key="header" class="text-xs-center" :class="selected === 'S' ? 'active-card' : ''">
              <span class="full-width">본당 코드</span>
            </v-subheader>
            <v-radio-group v-model="areaCode.sa_code" class="pl-2" v-if="areaCode.ma_code !== ''">
              <template v-for="(item, index) in _s_codes()" v-if="item.s_code !== ''">
                <v-list-tile :key="item.s_code + index" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.s_code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.s_name }} ({{ item.s_code|areaCode(6, 8) }})</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <template v-else-if="sAreaCodes.length === 0">
                <v-text-field label="데이터가 없습니다."></v-text-field>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <item-dialog ref="codes" :visible="inputDlg" @close-input-item="onInputItem" refs="codes" />
  </v-container>
</template>

<script>
import CodeMixin from '@/common/code.mixin'
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'
import { uniqBy, last } from 'lodash/array'
import { filter, find } from 'lodash/collection'
import { startsWith } from 'lodash/string'
import { UPDATE_AREA_CODE, DELETE_AREA_CODE, FETCH_AREA_CODES } from '../store/actions.type'

export default {
  name: 'AreaCode',
  mixins: [ CodeMixin ],
  components: { MenuButtons, ItemDialog },
  data: () => ({
    selected: '',
    codeName: '',
    l_codes: null,
    m_codes: null,
    s_codes: null,
    inputDlg: false,
    isChanged: false
  }),
  created () {
    this.areaCode.la_code = '01'
    this.selected = 'M'

    /* this.$store.subscribe((mutation) => {
      if (mutation.type === 'setAreaCode') {
        console.log(mutation.payload)
      }
    }) */
  },
  async beforeDestroy () {
    this.isChanged && await this.$store.dispatch(FETCH_AREA_CODES)
  },
  computed: {
    getCode () {
      if (this.selected === 'S') {
        return this.areaCode.sa_code
      } else if (this.selected === 'M') {
        return this.areaCode.ma_code
      } else return this.areaCode.la_code
    },
    /* getName () {
      if (this.selected === 'S') {
        return this._code_name(this.areaCode.sa_code)
      } else if (this.selected === 'M') {
        return this._code_name(this.areaCode.ma_code)
      } else return this._code_name(this.areaCode.la_code)
    }, */
    getLastCode () {
      const code = this._last()
      if (!code) return alert('구역 코드 확인이 필요합니다. 최고 관리자에게 문의해주세요.')

      let [lc, mc, sc] = code.split('-')
      if (sc) {
        sc = this._formatted(parseInt(sc) + 1)
        return [lc, mc, sc].join('-')
      } else if (mc) {
        mc = this._formatted(parseInt(mc) + 1)
        return [lc, mc].join('-')
      } else if (lc) {
        lc = this._formatted(parseInt(lc) + 1, 2)
        return lc.toString()
      } else return ''
    }
  },
  watch: {
    selected (val) {
      if (val === 'S') {
        if (!this.areaCode.ma_code) {
          this.selected = 'M'
          return alert('지구 코드 설정이 필요합니다.')
        }
        let lName = this._code_name(this.areaCode.la_code)
        let mName = this._code_name(this.areaCode.ma_code)
        this.codeName = `${(lName ? ` (${lName}) ` : '')}교구 > ${(mName ? ` (${mName}) ` : '')}지구 > 본당 추가`
      } else if (val === 'M') {
        if (!this.areaCode.la_code) {
          this.selected = 'L'
          return alert('교구 코드 설정이 필요합니다.')
        }
        let name = this._code_name(this.areaCode.la_code)
        this.codeName = `${(name ? ` (${name}) ` : '')}교구 > 지구 추가`
      } else if (val === 'L') {
        this.codeName = '교구 추가'
        this.areaCode.ma_code = ''
      }
    }
  },
  methods: {
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.codes.setItem({code: this.getLastCode, name: ''})
        this.inputDlg = true
        return
      }
      if (!this.getCode) return alert('구역을 선택해주세요!')
      // if (type === 'remove') confirm('선택한 항목을 삭제하시겠습니까?') && this.deleteItem(this.getCode)
      if (type === 'update') {
        this.$refs.codes.setItem({code: this.getCode, name: this._code_name(this.getCode)})
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      // console.log('input item...', data)
      this.saveItem(data)
    },
    onChangedCode (type, val) {
      if (val) this.selected = type.toUpperCase()
      this.$forceUpdate()
    },
    deleteItem (code) {
      this.$store.dispatch(DELETE_AREA_CODE, code)
      this.isChanged = true
    },
    async saveItem (item) {
      let data = {
        lc: this.areaCode.la_code,
        ln: this._code_name(this.areaCode.la_code)
      }
      if (this.selected === 'S') {
        data.ac = data.sc = item.code
        data.sn = item.name
        data.mc = this.areaCode.ma_code
        data.mn = this._code_name(this.areaCode.ma_code)
      } else if (this.selected === 'M') {
        data.ac = data.mc = item.code
        data.mn = item.name
      } else {
        data.ac = this.areaCode.la_code
      }

      await this.$store.dispatch(UPDATE_AREA_CODE, data)
      this.isChanged = true
      this.$forceUpdate()
    },
    _code_name (code) {
      if (!code) return ''
      let res = null
      if (code.length > 5) {
        res = find(this._s_codes(), (o) => o.s_code === code)
        if (res && res.s_name) return res.s_name
      } else if (code.length > 2) {
        res = find(this._m_codes(), (o) => o.m_code === code)
        if (res && res.m_name) return res.m_name
      } else {
        res = find(this._l_codes(), (o) => o.l_code === code)
        if (res && res.l_name) return res.l_name
      }
      return ''
    },
    _l_codes () {
      if (!this.areaCodes.length) return
      return uniqBy(this.areaCodes, 'l_code')
    },
    _m_codes () {
      if (!this.areaCodes.length) return
      const res = filter(uniqBy(this.areaCodes, 'm_code'), (o) => startsWith(o.a_code, `${this.areaCode.la_code}-`) && o.m_code)
      return res
    },
    _s_codes () {
      if (!this.areaCodes.length) return
      const res = filter(uniqBy(this.areaCodes, 's_code'), (o) => startsWith(o.a_code, `${this.areaCode.ma_code}`) && o.s_code)
      return res
    },
    _last () {
      let code = null
      if (this.selected === 'S') {
        code = last(this.sAreaCodes).s_code
        if (!code) code = `${this.areaCode.ma_code}-000`
      } else if (this.selected === 'M') {
        code = last(this.mAreaCodes).m_code
        if (!code) code = `${this.areaCode.la_code}-000`
      } else code = last(this.lAreaCodes).l_code
      return code
    },
    _formatted (ic, n = 2) {
      if (n === 3) {
        return ic < 10 ? `00${ic}` : (ic < 100 ? `0${ic}` : ic)
      } else {
        return ic < 10 ? `0${ic}` : ic
      }
    }
  },
  filters: {
    areaCode (code, sp, ep) {
      return code && code.slice(sp, ep)
    }
  }
}
</script>

<style scoped>
  .full-width {
    width: 100%;
  }
  .active-card {
    background-color: #2c3e50;
    color: #c4e6f5 !important;
    font-weight: bold;
  }
</style>
