<template>
  <v-container pt-2>
    <v-layout row wrap align-center mb-1>
      <v-flex xs3>
        <v-subheader class="subheading font-weight-bold px-0">신사베드로어디오하지본당
        </v-subheader>
      </v-flex>
      <v-flex xs7>
        <v-subheader class="body-2 justify-end"><span class="mr-2">대표 봉사자 :</span>
          <input value="김대건 안드레아" class="pa-1 input-box">
        </v-subheader>
      </v-flex>
      <v-flex xs2>
        <menu-buttons class="pt-0 pb-0" refs="acts" @click-menu="onClickMenu"/>
      </v-flex>
    </v-layout>
    <v-data-table :headers="headers" :items="items" hide-actions
                  class="elevation-1"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-for="header in props.headers" :key="header.text"
              class="body-2 font-weight-regular align-center"
          >{{ header.text }}
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
          <td class="text-xs-center">{{ props.item.idx }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.act_name }}</td>
          <td class="text-xs-center">{{ props.item.groups }}</td>
          <td class="text-xs-center">{{ props.item.numbers }}</td>
          <td class="text-xs-center">{{ props.item.s_date }}</td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center">봉사 내역이 없습니다.</div>
      </template>
    </v-data-table>
    <item-dialog ref="acts" :visible="inputDlg" @close-input-item="onInputItem" refs="acts"/>
  </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'

export default {
  name: 'ReportActs',
  components: { MenuButtons, ItemDialog },
  computed: {
    groups () {
      return this.$store.getters.actCodes
    }
  },
  data: () => ({
    items: [],
    selected: {},
    inputDlg: false,
    headers: [
      { text: '순서', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '봉사 활동명', value: 'act_name' },
      { text: '그룹 수', value: 'groups' },
      { text: '총 인원', value: 'numbers' },
      { text: '시작한 날', value: 's_date' }
    ]
  }),
  methods: {
    onClickMenu (type) {
      if (type === 'add') {
        this.$refs['acts'].reset()
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사 내역을 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사 내역을 삭제하시겠습니까?') && this.deleteItem(this.selected.id)
      else { // update
        this.$refs['acts'].setItem(this.selected)
        this.inputDlg = true
      }
    },
    onInputItem (data) {
      this.inputDlg = false
      if (data === undefined) return

      const res = this.groups.find(o => o.code === data.grp_code)
      data.grp_name = res ? res.name : '없음'
      data.idx = this.items.length + 1
      console.log('input item...', data)
      this.items.push(data)
    }
  }
}
</script>

<style scoped>
</style>
