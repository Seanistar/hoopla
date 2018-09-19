<template>
  <v-container pt-2>
    <inline-text-box/>
    <v-data-table hide-actions class="elevation-1" :items="items">
      <template slot="headers" slot-scope="props">
        <tr>
          <th rowspan="2" class="body-2 font-weight-bold w-10">연도</th>
          <th colspan="6" class="body-2 font-weight-bold w-90">교육 참석 현황</th>
        </tr>
        <tr>
          <th class="body-1 w-15">성서40주간<br>읽기안내</th>
          <th class="body-1 w-15">성서40주간<br>심화</th>
          <th class="body-1 w-15">월교육</th>
          <th class="body-1 w-15">재교육</th>
          <th class="body-1 w-15">피정</th>
          <th class="body-1 w-15">기타교육</th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr> <!--@click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">-->
          <td class="text-xs-center">{{ props.item|divine }}</td>
          <td class="text-xs-center" v-for="(ec) in ebsCodes">{{ props.item|yearObj|counter(ec) }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr class="text-xs-center"><td colspan="16">현황 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import InlineTextBox from './control/InlineTextBox'
import { mapGetters } from 'vuex'
import { QUERY_VOLUNTEER_ITEM } from '@/store/actions.type'
import { groupBy } from 'lodash/collection'

export default {
  name: 'QueryEdus',
  components: { InlineTextBox },
  computed: {
    ...mapGetters([
      'ebsCodes',
      'queryInfo',
      'queriedVoltItems'
    ])
  },
  data: () => ({
    items: []
  }),
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const vID = this.queryInfo.good.id
      this.$store.dispatch(QUERY_VOLUNTEER_ITEM, {e_type: 'E', v_id: vID})
      setTimeout(() => {
        this._mapData()
      }, 10)
    },
    _mapData () {
      const qv = this.queriedVoltItems
      if (!qv) return

      const yg = groupBy(qv, 'e_year')
      Object.keys(yg).forEach(k => {
        yg[k] = groupBy(yg[k], 'e_code')
        let obj = {}; obj[k] = yg[k]
        this.items.push(obj)
      })
      this.items.reverse()
    }
  },
  filters: {
    divine (val) {
      return Object.keys(val)[0]
    },
    yearObj (val) {
      const key = Object.keys(val)[0]
      return val[key]
    },
    counter (val, obj) {
      if (!val[obj.code]) return
      return val[obj.code][0].counter
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
    padding: 5px;
    text-align: center;
  }
</style>
