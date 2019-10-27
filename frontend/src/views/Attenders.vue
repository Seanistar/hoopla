<template>
  <v-container class="elevation-5 pt-3">
    <v-layout row align-baseline pb-3>
      <v-flex class="xs12">
        <input type="file" id="csvFileInput" @change="onHandleFiles($event.target.files)" accept=".csv">
      </v-flex>
      <!--<v-flex xs2 v-if="winWidth >= 900">
        <v-layout justify-end>
          <v-btn color="indigo accent-2" outline dark class="mb-3" @click="newVolunteer">신규 봉사자</v-btn>
        </v-layout>
      </v-flex>-->
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="parsed === false">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :headers="headers" :items="attenders" :expand="false" item-key="no"
                  :pagination.sync="pagination" :rows-per-page-items="perPage">
      <template slot="items" slot-scope="props">
        <tr class="first-row" @click="props.expanded = !props.expanded">
          <td class="text-xs-center">{{(props.item.no)}}</td>
          <td class="text-xs-center">{{ props.item.date }}</td>
          <td class="text-xs-center">{{ props.item.time }}</td>
          <td class="text-xs-center">{{ props.item.device_id }}</td>
          <td class="text-xs-center">{{ props.item.user_id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.sco_no }}</td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">{{ props.item.mode }}</td>
          <td class="text-xs-center">{{ props.item.auth }}</td>
          <td class="text-xs-center">{{ props.item.result }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-3" @click.self="onEditItem(props.item)">edit</v-icon>
            <v-icon small @click.self="onDeleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
          <v-card flat class="text-xs-center w-100">
            <v-card-text>Peek-a-boo!</v-card-text>
          </v-card>
      </template>
      <template slot="no-data" v-if="parsed">
        <v-alert :value="true" color="warning" icon="warning">
          표시할 출석자 정보가 없습니다.
        </v-alert>
      </template>
    </v-data-table>

  </v-container>
</template>

<script>
import { map } from 'lodash/collection'

export default {
  name: 'Attenders',
  data () {
    return {
      perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
      pagination: { sortBy: 'id', rowsPerPage: 100 },
      attenders: [],
      headers: [{text: '발생일자'}, {text: '발생시각'}, {text: '단말기 ID'}, {text: '사용자 ID'}, {text: '이름'},
        {text: '주민번호'}, {text: '구분'}, {text: '모드'}, {text: '인증'}, {text: '결과'}],
      parsed: null,
      contexts: ['date', 'time', 'device_id', 'user_id', 'name', 'sco_no', 'type', 'mode', 'auth', 'result']
    }
  },
  created () {
    this.headers = map(this.headers, (h, i) => ({text: h.text, value: this.contexts[i], align: 'center', sortable: false}))
    this.headers.unshift({text: '번호', value: 'no', align: 'center', sortable: false})
    this.headers.push({text: '편집', value: 'edit', align: 'center', sortable: false})
  },
  methods: {
    onHandleFiles (files) {
      this.attenders = []; this.parsed = null

      if (window.FileReader) {
        const reader = new FileReader()
        reader.readAsText(files[0], 'euc-kr')
        reader.onload = this.loadHandler
        reader.onerror = this.errorHandler
      } else {
        alert('FileReader are not supported in this browser.')
      }
    },
    loadHandler (event) {
      const csv = event.target.result
      const allTextLines = csv.split(/\r\n|\n/)
      for (let i = 0; i < allTextLines.length - 1; i++) {
        const data = allTextLines[i].split(',').filter(d => d)
        if (i === 0 || !data) continue

        const lineItem = {no: i}
        map(data.slice(0, this.contexts.length), (d, n) => {
          lineItem[this.contexts[n]] = d.startsWith("'") ? d.slice(1) : d
        })
        this.attenders.push(lineItem)
      }
      this.parsed = true
      console.log('parsed...', this.attenders.length)
    },
    errorHandler (evt) {
      if (evt.target.error.name === 'NotReadableError') {
        alert("Can't read file !")
      }
      this.parsed = false
    },
    onEditItem () {
    },
    onDeleteItem () {
    }
  }
}
</script>

<style scoped>

</style>
