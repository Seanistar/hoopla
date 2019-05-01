<template>
  <v-container pt-2>
    <v-layout align-center mb-1>
      <v-flex :class="$parent.winWidth < 900 ? 'xs6' : 'xs4'">
        <v-subheader class="subheading font-weight-bold">{{s_name}} 본당 ({{$parent.E_DATE.slice(0, 4)}})
        </v-subheader>
      </v-flex>
      <v-flex :class="$parent.winWidth < 900 ? 'xs6' : 'xs8'">
        <v-layout justify-end>
          <v-subheader class="body-2 w-27 pr-0">
            <span class="mr-2">총 봉사자수 :</span>
            <input :value="volts.tv" readonly class="pa-1 text-xs-right input-box mr-1">명
          </v-subheader>
          <!--<v-subheader class="body-2 w-27 pr-0">
            <span class="mr-2">활동 봉사자수 :</span>
            <input :value="volts.av" readonly class="pa-1 text-xs-right input-box mr-1">명
          </v-subheader>
          <v-subheader class="body-2 w-27 pr-0">
            <span class="mr-2">쉬는 봉사자수 :</span>
            <input :value="volts.bv" readonly class="pa-1 text-xs-right input-box mr-1">명
          </v-subheader>-->
        </v-layout>
      </v-flex>
      <!--<v-flex xs12 sm3>
        <menu-buttons class="pt-0 pb-0" refs="state" @click-menu="onClickMenu" v-show="false"/>
      </v-flex>-->
    </v-layout>
    <v-data-table :headers="headers" :items="reportVolts" hide-actions
                  class="elevation-5">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="moveToQuery(props.item.id)"> <!--@click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'white')}">-->
          <td class="text-xs-center">{{ props.item.ca_id|churchID }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.au_date }}</td>
          <td class="text-xs-center">{{ activityState[props.item.state] }}</td>
          <td class="text-xs-center">{{ props.item.phone|formatted }}</td>
          <td class="text-xs-center">{{ props.item.other_name }}</td>
          <td class="text-xs-center">{{ props.item.br_date }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <tr><td colspan="7" class="text-xs-center">봉사자 내역이 없습니다.</td></tr>
      </template>
    </v-data-table>
    <!--<item-dialog ref="volts" :visible="inputDlg" @close-input-item="onInputItem" refs="volts"/>-->
  </v-container>
</template>

<script>
// import MenuButtons from './control/MenuButtons'
// import ItemDialog from './control/InputItemDialog'
import { FETCH_REPORT_VOLTS } from '@/store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'ReportVolunteers',
  // components: { MenuButtons, ItemDialog },
  computed: {
    ...mapGetters([
      'reportVolts'
    ]),
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망' }
    }
  },
  data: () => ({
    s_name: null,
    volts: { tv: 0, av: 0, bv: 0 },
    fetched: false,
    /* model: '',
    search: null,
    selected: {},
    inputDlg: false, */
    headers: [
      { text: '고유코드', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '선서일', value: 'au_date' },
      { text: '활동상태', value: 'state' },
      { text: '연락처', value: 'phone', sortable: false },
      { text: '타본당 봉사', value: 'other_code' },
      { text: '생년월일', value: 'br_date' }
    ]
  }),
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2', 'pl-39x'] })
    // this.selected.id = 0
    const res = this.$parent.getSmall()
    if (res) {
      this.s_name = res.s_name
      this.fetchData(res.s_code)
    }
  },
  methods: {
    async fetchData (code) {
      const sDate = this.$parent.S_DATE
      const eDate = this.$parent.E_DATE
      await this.$store.dispatch(FETCH_REPORT_VOLTS, {a_code: code, s_date: sDate, e_date: eDate})
      this.fetched = true
      this.makeSTAT()
    },
    makeSTAT () {
      this.volts.tv = this.reportVolts.length
      this.reportVolts.forEach(o => {
        if (o.state === 'ACT') this.volts.av += 1
        else if (o.state === 'BRK') this.volts.bv += 1
      })
    },
    moveToQuery (id) {
      this.$router.push({name: 'edit-volunteer', params: {id: id, menu: 'm-0'}})
    }
    /* onClickMenu (type) {
      if (type === 'add') {
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사자를 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사자를 삭제하시겠습니까?') && this.deleteItem(this.selected.id)
      else { // update
        this.$refs.volts.setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      console.log('input item...', data)
      data.idx = this.items.length + 1
      this.items.push(data)
    },
    deleteItem (id) {
      const pos = this.items.findIndex(o => o.id === id)
      if (pos > -1) this.items.splice(pos, 1)
    } */
  },
  filters: {
    formatted (no) {
      if (!no) return ''
      if (no && no.toString().indexOf('-') > 0) return no
      const pn1 = no.toString().slice(0, 3)
      const pn2 = no.toString().slice(3, 7)
      const pn3 = no.toString().slice(7)
      return `${pn1}-${pn2}-${pn3}`
    },
    churchID (id) {
      const n1 = id.toString().slice(0, 2)
      const n2 = id.toString().slice(2)
      return `${n1}-${n2}`
    }
  }
}
</script>

<style scoped>
  .input-box {
    width: 26%;
    padding-right: 8px !important;
  }
  .w-27 {
    width: 27.5%;
  }
  tr td {
    cursor: pointer
  }
  @media only screen and (max-width: 900px) {
    .w-27 {
      width: 98%;
    }
  }
</style>
