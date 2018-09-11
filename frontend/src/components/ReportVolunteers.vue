<template>
  <v-container>
      <v-layout row wrap align-center pb-2>
        <v-flex xs12 sm9>
          <v-layout row>
            <v-subheader class="subheading" style="width: 25%">
              <span class="mr-3">총 봉사자수 :</span>
              <v-flex xs4><v-text-field value="0" suffix="명" single-line></v-text-field></v-flex>
            </v-subheader>
            <v-subheader class="subheading" style="width: 30%">
              <span class="mr-3">활동 봉사자수 :</span>
              <v-flex xs4><v-text-field value="0" suffix="명" single-line></v-text-field></v-flex>
            </v-subheader>
            <v-subheader class="subheading" style="width: 30%">
              <span class="mr-3">쉬는 봉사자수 :</span>
              <v-flex xs4><v-text-field value="0" suffix="명" single-line></v-text-field></v-flex>
            </v-subheader>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm3>
          <menu-buttons class="pt-0 pb-1" refs="state" @click-menu="onClickMenu" v-show="false"/>
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
            <td class="text-xs-center">{{ props.item.phone }}</td>
            <td class="text-xs-center">{{ props.item.address }}</td>
            <td class="text-xs-center">{{ props.item.br_date }}</td>
            <td class="text-xs-center">{{ props.item.state }}</td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center">봉사자 내역이 없습니다.</div>
        </template>
      </v-data-table>
      <item-dialog ref="volts" :visible="inputDlg" @close-input-item="onInputItem" refs="volts"/>
    </v-container>
</template>

<script>
import MenuButtons from './control/MenuButtons'
import ItemDialog from './control/InputItemDialog'

export default {
  name: 'ReportVolunteers',
  components: { MenuButtons, ItemDialog },
  data: () => ({
    items: [],
    model: '',
    search: null,
    selected: {},
    inputDlg: false,
    headers: [
      { text: '순서', value: 'idx' },
      { text: '이름', value: 'name' },
      { text: '세례명', value: 'ca_name' },
      { text: '연락처', value: 'phone' },
      { text: '주소', value: 'address' },
      { text: '생년월일', value: 'br_date' },
      { text: '활동상태', value: 'state' }
    ]
  }),
  created () {
    this.selected.id = 0
  },
  methods: {
    onClickMenu (type) {
      if (type === 'add') {
        this.inputDlg = true
        return
      }
      if (!this.selected.id) return alert('봉사자를 선택해주세요!')
      if (type === 'remove') confirm('선택한 봉사자를 삭제하시겠습니까?') && this.deleteItem(this.selected.id)
      else { // update
        this.$refs['volts'].setItem(this.selected)
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
    }
  }
}
</script>

<style scoped>
</style>
