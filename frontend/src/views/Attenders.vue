<template>
  <v-container class="elevation-5 pt-3">
    <v-layout row align-baseline pb-2>
      <v-flex xs2>
        <v-select label="교육 유형 분류" v-model="edu.type" hide-details
                  :items="largeEdus" item-text="name" item-value="value"
        ></v-select>
      </v-flex>
      <v-flex xs2 pl-2>
        <v-select label="교육 항목" v-model="edu.code" hide-details
                  :items="smallEdus" item-text="name" item-value="code"
        ></v-select>
      </v-flex>
      <v-flex xs4 pl-2>
        <input type="file" id="csvFileInput" :disabled="manual === true"
               @change="onHandleFiles($event.target.files)" accept=".txt">
      </v-flex>
      <v-flex xs2>
        <v-radio-group v-model="manual" row hide-details>
          <v-radio label="일괄출석" :value="false"></v-radio>
          <v-radio label="개별출석" :value="true"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs2 text-xs-right>
        <v-btn color="indigo accent-2" outline class="mb-3" :loading="this.confirmed === false"
               :disabled="attenders.length === 0" @click="onUpdateAutomation">출석 처리</v-btn>
        <span>전체 {{attenders.length|units}} 명</span>
      </v-flex>
    </v-layout>

    <v-layout align-center justify-center class="progress-circular" v-if="parsed === false">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :headers="headers" :items="attenders"
                  :pagination.sync="pagination" :rows-per-page-items="perPage">
      <template slot="items" slot-scope="props">
        <tr class="first-row">
          <td class="text-xs-center">{{((pagination.page - 1) * pagination.rowsPerPage) + props.index + 1}}</td>
          <td class="text-xs-center">{{ props.item.v_id }}</td>
          <td class="text-xs-center">{{ props.item.ca_id|caID }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ props.item.la_name }}</td>
          <td class="text-xs-center">{{ props.item.ma_name }}</td>
          <td class="text-xs-center">{{ props.item.sa_name }}</td>
          <td class="justify-center layout px-0">
            <v-icon small @click.self="onDeleteItem(props.index)">delete</v-icon>
            <!--<v-icon small class="ml-4" @click.self="onEditItem(props.item)">edit</v-icon>-->
          </td>
        </tr>
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
import { mapGetters } from 'vuex'
import { map, find, filter } from 'lodash/collection'
import { UPDATE_AUTOMATION, FETCH_VOLUNTEERS } from '@/store/actions.type'

export default {
  name: 'Attenders',
  data () {
    return {
      perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
      pagination: { sortBy: 'id', rowsPerPage: 100 },
      attenders: [],
      edu: {type: null, code: null},
      manual: false,
      parsed: null,
      confirmed: null,
      stat: {pass: 0, fail: 0}
    }
  },
  computed: {
    ...mapGetters(['eduCodes']),
    headerFields () { return ['ID', '고유 번호', '성명', '세례명', '교구', '지구', '본당'] },
    contextFields () { return ['v_id', 'ca_id', 'name', 'ca_name', 'la_name', 'ma_name', 'sa_name'] },
    // rawFields () { return ['date', 'time', 'device_id', 'user_id', 'name', 'sco_no', 'type', 'mode', 'auth', 'result'] },
    headers () {
      const list = map(this.headerFields, (h, i) => ({text: h, value: this.contextFields[i], align: 'center', sortable: true}))
      list.unshift({text: '번호', value: 'no', align: 'center', sortable: false})
      list.push({text: '삭제', value: 'edit', align: 'center', sortable: false})
      return list
    },
    largeEdus () {
      return [
        {name: '기본 교육', value: 'E'},
        {name: '노트 검사', value: 'N'},
        {name: '성서 연수', value: 'T'},
        {name: '그룹 공부', value: 'G'},
        {name: '마두명', value: 'M'}
      ]
    },
    smallEdus () {
      if (!this.edu.type) return
      return filter(this.eduCodes, e => e.type === this.edu.type)
    }
  },
  created () {
  },
  methods: {
    onHandleFiles (files) {
      this.attenders = []

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
      const file = event.target.result
      this.parsed = false; this.confirmed = null
      const rawData = file.split(/\r\n|\n/).filter(f => f).map(d => d.slice(4))
      console.log('parsed...', rawData)
      /* for (let i = 0; i < allTextLines.length - 1; i++) {
        const lines = allTextLines[i].split(',').filter(d => d)
        if (i === 0 || !lines) continue

        const item = {no: i}
        map(lines.slice(0, this.rawFields.length), (d, n) => {
          item[this.rawFields[n]] = d.startsWith("'") ? d.slice(1) : d
        })

        if (data[item.user_id]) {
          data[item.user_id].count += 1
          if (item.mode === '출근') {
            data[item.user_id].start += 1
            data[item.user_id].start_time = item.time
          } else if (item.mode === '퇴근') {
            data[item.user_id].end += 1
            data[item.user_id].end_time = item.time
          }
        } else {
          data[item.user_id] = Object.assign({}, item)
          data[item.user_id].count = 1
          if (item.mode === '출근') {
            data[item.user_id].start = 1
            data[item.user_id].start_time = item.time
            data[item.user_id].end = 0
          } else if (item.mode === '퇴근') {
            data[item.user_id].end = 1
            data[item.user_id].end_time = item.time
            data[item.user_id].start = 0
          }
        }
      }
      this.stat.pass = 0; this.stat.fail = 0
      this.attenders = map(data, (d, k) => {
        d.mem_id = k
        if (d.start_time && d.end_time) {
          d.result = 'O'
          this.stat.pass += 1
        } else {
          d.result = 'X'
          this.stat.fail += 1
        }
        return d
      }) */
      const params = {unlimited: 1}
      return this.$store.dispatch(FETCH_VOLUNTEERS, {params})
        .then(data => {
          let noMatches = ''
          for (const id of rawData) {
            const one = find(data, d => d.ca_id === id)
            if (one) this.attenders.push(one)
            else noMatches += `${id}, `
          }
          if (noMatches) throw new Error(noMatches)
        }).catch(e => alert(`일치되는 봉사자가 없습니다. ${e}`))
        .finally(() => (this.parsed = true))
    },
    errorHandler (evt) {
      if (evt.target.error.name === 'NotReadableError') {
        alert('파일을 읽을 수 없습니다.!')
      }
      this.parsed = false
    },
    onUpdateAutomation () {
      if (!confirm('현재 리스트대로 출석 처리하시겠습니까?')) return
      if (!this.edu_code) return alert('교육 항목을 선택해주세요!')

      this.confirmed = false
      const now = new Date()
      const payload = {
        attenders: map(this.attenders, a => ({id: a.v_id, a_code: a.area_code})),
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        edu_code: this.edu.code
      }

      this.$store.dispatch(UPDATE_AUTOMATION, payload).then(() => {
        alert('모두 출석 처리되었습니다.')
      }).finally(() => (this.confirmed = true))
    },
    onDeleteItem (index) {
      if (!confirm('선택한 항목을 삭제하시겠습니까?')) return
      this.attenders.splice(index, 1)
    }
  },
  filters: {
    units (x) {
      if (!Number.isInteger(x) || Number.isNaN(x)) return x
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    caID (x) {
      const s = x.slice(0, 2); const e = x.slice(2)
      return `${s}-${e}`
    }
  }
}
</script>
