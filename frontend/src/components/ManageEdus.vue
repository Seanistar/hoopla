<template>
  <v-container class="elevation-2 mt-3 pt-1">
    <v-layout row align-baseline>
      <v-flex xs12 sm3>
        <v-text-field label="편집할 항목을 선택하세요." class="py-0 body-1"
                      single-line readonly :value="codeName"></v-text-field>
      </v-flex>
      <v-flex xs12 sm2 offset-sm7>
        <menu-buttons refs="codes" :menu="['add', 'edit']" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs3 @click="selected = 'E'">
        <v-card :raised="selected === 'E'">
          <v-list>
            <v-subheader key="header" class="text-xs-center" :class="selected === 'E' ? 'active-card' : ''">
              <span class="full-width">기본교육 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.e" mandatory class="pl-2">
              <template v-for="(item) in ebsCodes">
                <v-list-tile :key="item.code" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs3 class="ml-3" @click="selected = 'T'">
        <v-card :raised="selected === 'T'">
          <v-list>
            <v-subheader key="header" class="text-xs-center" :class="selected === 'T' ? 'active-card' : ''">
              <span class="full-width">성서연수 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.t" class="pl-2">
              <template v-for="(item) in trnCodes">
                <v-list-tile :key="item.code " ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name|subject }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs3 class="ml-3" @click="selected = 'N'">
        <v-card :raised="selected === 'N'">
          <v-list >
            <v-subheader key="header" class="text-xs-center" :class="selected === 'N' ? 'active-card' : ''">
              <span class="full-width">노트검사 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.n" class="pl-2">
              <template v-for="(item) in stdCodes">
                <v-list-tile :key="item.code" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name|subject }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs3 class="ml-3" @click="selected = 'G'">
        <v-card :raised="selected === 'G'">
          <v-list >
            <v-subheader key="header" class="text-xs-center" :class="selected === 'G' ? 'active-card' : ''">
              <span class="full-width">그룹공부 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.g" class="pl-2">
              <template v-for="(item) in grpCodes">
                <v-list-tile :key="item.code" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name|subject }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs3 class="ml-3" @click="selected = 'M'">
        <v-card :raised="selected === 'M'">
          <v-list >
            <v-subheader key="header" class="text-xs-center" :class="selected === 'M' ? 'active-card' : ''">
              <span class="full-width">마두명 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.m" class="pl-2">
              <template v-for="(item) in maoCodes">
                <v-list-tile :key="item.code" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name|subject }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs3 class="ml-3" @click="selected = 'A'">
        <v-card :raised="selected === 'A'">
          <v-list >
            <v-subheader key="header" class="text-xs-center" :class="selected === 'A' ? 'active-card' : ''">
              <span class="full-width">봉사활동 코드</span>
            </v-subheader>
            <v-radio-group v-model="code.a" class="pl-2">
              <template v-for="(item) in actCodes">
                <v-list-tile :key="item.code" ripple>
                  <v-list-tile-action>
                    <v-radio :value="item.code"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <item-dialog ref="eac" :visible="inputDlg" @close-input-item="onInputItem" refs="eac" />
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'
import { last } from 'lodash/array'
import { UPDATE_EDUS_CODE } from '../store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'EdusCode',
  components: { MenuButtons, ItemDialog },
  data: () => ({
    selected: 'E',
    codeName: '',
    inputDlg: false,
    code: {e: '', t: '', n: '', a: '', g: '', m: ''}
  }),
  created () {
  },
  computed: {
    ...mapGetters([
      'stdCodes',
      'ebsCodes',
      'trnCodes',
      'actCodes',
      'grpCodes',
      'maoCodes'
    ]),
    getCode () {
      return this.code[this.selected.toLowerCase()]
    },
    getName () {
      let obj = null
      const cd = this.getCode
      if (this.selected === 'E') obj = this.ebsCodes.find(o => o.code === cd)
      else if (this.selected === 'T') obj = this.trnCodes.find(o => o.code === cd)
      else if (this.selected === 'N') obj = this.stdCodes.find(o => o.code === cd)
      else if (this.selected === 'A') obj = this.actCodes.find(o => o.code === cd)
      else if (this.selected === 'G') obj = this.grpCodes.find(o => o.code === cd)
      else if (this.selected === 'M') obj = this.maoCodes.find(o => o.code === cd)
      return obj.name
    },
    getLastCode () {
      let codes = null
      if (this.selected === 'E') codes = this.ebsCodes.map(o => o.code)
      else if (this.selected === 'T') codes = this.trnCodes.map(o => o.code)
      else if (this.selected === 'N') codes = this.stdCodes.map(o => o.code)
      else if (this.selected === 'A') codes = this.actCodes.map(o => o.code)
      else if (this.selected === 'G') codes = this.grpCodes.find(o => o.code)
      else if (this.selected === 'M') codes = this.maoCodes.find(o => o.code)
      return last(codes) + 1
    }
  },
  watch: {
    selected (val) {
      if (val === 'E') this.codeName = '기본 교육 코드 추가'
      else if (val === 'T') this.codeName = '성서 연수 코드 추가'
      else if (val === 'N') this.codeName = '노트 검사 코드 추가'
      else if (val === 'A') this.codeName = '봉사 활동 코드 추가'
      else if (val === 'G') this.codeName = '그룹 공부 코드 추가'
      else if (val === 'M') this.codeName = '마두명 코드 추가'
    },
    code: {
      handler: function (obj) {
        console.log(obj)
      },
      deep: true
    }
  },
  methods: {
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.eac.setItem({code: `${this.selected}-${this.getLastCode}`, name: ''})
        this.inputDlg = true
        return
      }
      if (!this.getCode) return alert('구역을 선택해주세요!')
      if (type === 'edit') { // update
        this.$refs.eac.setItem({code: `${this.selected}-${this.getCode}`, name: this.getName})
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      [data.type, data.code] = data.code.split('-')
      console.log('input item...', data)
      this.updateItem(data)
      this.$showSnackBar('처리되었습니다!')
    },
    async updateItem (item) {
      await this.$store.dispatch(UPDATE_EDUS_CODE, item)
      this.$forceUpdate()
    }
  },
  filters: {
    subject (name) {
      const [tr, nm] = name.split('-')
      return nm ? nm.trim() : tr.trim()
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
    color: #c4e6f5;
    font-weight: bold;
  }
  .v-list__tile__action {
    min-width: 40px !important;
  }
</style>
