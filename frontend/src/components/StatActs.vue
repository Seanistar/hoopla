<template>
  <v-container pt-2 mt-1>
    <v-layout row align-baseline>
      <v-flex xs3>
        <v-combobox label="본당을 선택하세요" class="text-xs-center body-2" clearable
                  :items="churchList" item-value="code" item-text="name"
                  v-model="church"></v-combobox>
      </v-flex>
    </v-layout>
    <v-data-table :items="items" hide-actions class="elevation-1">
      <template slot="headers" slot-scope="props">
        <tr>
          <th class="align-center body-2"><p class="head-title"></p></th>
          <th class="align-center body-2"><p class="head-title">성명</p></th>
          <th class="align-center body-2"><p class="head-title"></p></th>
          <th class="align-center body-2" v-for="header in stdCodes" :key="header.code"><p class="head-title">{{header.name|subject}}</p></th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr>
          <td rowspan="2" class="text-xs-center w-5">{{props.index + 1}}</td>
          <td rowspan="2" class="text-xs-center w-10">{{props.item|v_name}}<br/>{{props.item|ca_name}}</td>
          <td>노트</td>
          <td class="text-xs-left"
              v-for="at in stdCodes" :key="at.code"><span class="caption pl-2">{{props.item|keyBy|ready(at.code)}}</span>
          </td>
        </tr>
        <tr>
          <td>봉사</td>
          <td class="text-xs-left"
              v-for="at in actCodes" :key="at.code">
              <div class="caption pl-2" v-for="(oa, idx) in orgList(props.item, at.code)" :key="idx">{{oa.a_year}} {{orgActor(oa)}}</div>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="34">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_STAT_ACTS } from '@/store/actions.type'
import { groupBy, orderBy, map, find } from 'lodash/collection'
import { pick } from 'lodash/object'
import FiltersMixin from '../common/filters.mixin'

export default {
  name: 'StatYearly',
  mixins: [ FiltersMixin ],
  computed: {
    ...mapGetters([
      'actCodes',
      'stdCodes',
      'smallCodes',
      'statActs'
    ])
  },
  data: () => ({
    items: [],
    churchList: [],
    church: { code: '01-17-07', name: '우장산' }
  }),
  watch: {
    church (nv, ov) {
      if (!nv) {
        this.items = []
        return
      }
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
    this.$nextTick(() => this.setArea())
  },
  methods: {
    async fetchData () {
      if (!this.church || !this.church.code) return
      const params = { code: this.church && this.church.code }
      await this.$store.dispatch(FETCH_STAT_ACTS, {params})
      this.$nextTick(() => { this._mapData() })
    },
    _mapData () {
      const qv = this.statActs
      if (!qv) return

      this.items = []
      const yg = groupBy(qv, 'v_id')
      Object.keys(yg).forEach(k => {
        const vl = pick(yg[k][0], ['v_name', 'ca_name'])
        yg[k] = groupBy(yg[k], 'a_code')
        let obj = {}; obj[k] = yg[k]
        Object.assign(obj[k], vl)
        this.items.push(obj)
      })
    },
    setArea () {
      const list = map(this.smallCodes(), o => {
        const full = `${o.s_name} (${o.l_name}-${o.m_name})`
        return {code: o.s_code, name: full}
      })
      this.churchList = orderBy(list, ['name'])
    },
    orgList (val, code) {
      const key = Object.keys(val)[0]
      const tar = val[key][code]
      return !Array.isArray(tar) ? null : tar
    },
    orgActor (obj) {
      const org = obj.og_code
      if (!org) return
      const res = find(this.smallCodes(), (o) => o.s_code === org)
      return res ? res.s_name.slice(0, 3) : ''
    }
  }
}
</script>

<style scoped>
  table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
  }
  th, td {
    max-width: 25px !important;
    min-width: 20px !important;
    padding: 3px !important;
    text-align: center;
  }
  .w-5 {
    width: 5% !important;;
  }
  .head-title {
    white-space: normal;
    margin-bottom: 0 !important;
  }
</style>
