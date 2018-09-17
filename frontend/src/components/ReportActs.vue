<template>
  <v-container pt-2 pb-2>
    <v-layout row wrap align-center mb-1>
      <v-flex xs3>
        <v-subheader class="subheading font-weight-bold pr-0">{{small.nm}} 본당
        </v-subheader>
      </v-flex>
      <v-flex xs9>
        <v-subheader class="body-2 justify-end"><span class="mr-2">대표 봉사자 :</span>
          <input value="" class="pa-1 input-box">
        </v-subheader>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="reportActs" hide-actions
                  class="elevation-5" :loading="fetched && isReportsLoading">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" @dblclick="onClickMenu('update')"
            :style="{backgroundColor: (selected.id && selected.id === props.item.id ? 'orange' : 'white')}">
          <td class="text-xs-center">{{ props.item.idx }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.act_name }}</td>
          <td class="text-xs-center">{{ props.item.grp_count }}</td>
          <td class="text-xs-center">{{ props.item.numbers }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">봉사 내역이 없습니다.</div>
      </template>
    </v-data-table>
    <v-layout justify-end pt-2 pb-0>
      <v-flex xs12>
        <menu-buttons refs="acts" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <item-dialog ref="acts" :visible="inputDlg" @close-input-item="onInputItem" refs="acts"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'
import { pick } from 'lodash/object'
import { FETCH_REPORT_ACTS, CREATE_REPORT_ACT, UPDATE_REPORT_ACT, DELETE_REPORT_ACT } from '@/store/actions.type'
// import { FETCH_REPORT_ACTS_END } from '@/store/mutations.type'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'ReportActs',
  components: { MenuButtons, ItemDialog },
  computed: {
    ...mapGetters([
      'reportActs',
      'isReportsLoading',
      'actCodes'
    ])
  },
  created () {
    this.headers.map(h => { h.class = ['text-xs-center', 'body-2'] })
    const res = this.$parent.getSmall()
    if (res) {
      this.small.nm = res.s_name
      this.fetchData(this.small.cd = res.s_code)
    }
  },
  data: () => ({
    items: [],
    selected: {},
    inputDlg: false,
    fetched: false,
    small: { nm: '', cd: '' },
    headers: [
      { text: '고유코드', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '봉사 활동명', value: 'act_name' },
      { text: '그룹 수', value: 'grp_count' },
      { text: '총 인원', value: 'numbers' },
      { text: '시작한 날', value: 's_date' }
    ]
  }),
  methods: {
    ...mapActions([
      FETCH_REPORT_ACTS,
      CREATE_REPORT_ACT,
      UPDATE_REPORT_ACT,
      DELETE_REPORT_ACT
    ]),
    ...mapMutations([
      // FETCH_REPORT_ACTS_END
    ]),
    async fetchData (code) {
      // await this.$store.dispatch(FETCH_REPORT_ACTS, code)
      await this[FETCH_REPORT_ACTS](code)
      this.fetched = true
    },
    deleteActItem (id) {
      this[DELETE_REPORT_ACT](id)
    },
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs.acts.setItem({s_name: this.small.nm, s_code: this.small.cd, id: 0})
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사 내역을 삭제하시겠습니까?') && this.deleteActItem(this.selected.id)
      else { // update
        this.selected.act_code = parseInt(this.selected.act_code)
        this.selected.s_name = this.small.nm
        this.$refs.acts.setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      // const res = this.actCodes.find(o => o.code === data.act_code)
      // data.act_name = res ? res.name : '없음'
      if (data.v_id === undefined) data.v_id = data.id
      const item = pick(data, ['id', 'v_id', 'act_code', 'area_code', 's_date', 'e_date', 'content', 'numbers'])
      console.log('input item...', item)
      this.updateActItem(item)
    },
    async updateActItem (data) {
      if (this.selected.id === undefined) {
        await this[CREATE_REPORT_ACT](data)
        this.$showSnackBar('추가되었습니다.')
      } else {
        await this[UPDATE_REPORT_ACT](data)
        this.$showSnackBar('수정되었습니다.')
      }

      this.$forceUpdate()
      this.$nextTick(() => {
        // this.fetchData(this.small.cd)
      })
    }
  }
}
</script>

<style scoped>
</style>
