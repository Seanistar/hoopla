<template>
  <v-container class="elevation-5 pt-3">
    <v-layout row align-baseline>
      <v-flex xs1>
        <v-select label="교육 유형" v-model="edu.type" hide-details
                  :disabled="MODE_HISTORICAL"
                  :items="largeEdus" item-text="name" item-value="value"
        ></v-select>
      </v-flex>
      <v-flex xs2 pl-3>
        <v-select label="교육 항목" v-model="edu.code" hide-details
                  :disabled="MODE_HISTORICAL"
                  :items="smallEdus" item-text="name" item-value="code"
        ></v-select>
      </v-flex>
      <v-flex xs1 pl-3 v-if="TYPE_EDU_MONTH">
        <v-select label="월 선택" v-model="edu.month" hide-details
                  :disabled="MODE_HISTORICAL"
                  :items="months"
        ></v-select>
      </v-flex>
      <v-flex :class="TYPE_EDU_MONTH ? 'xs3' : 'xs4'" pl-3>
        <input type="file" id="txtFileInput" :disabled="!MODE_TOTALLY"
               @change="onHandleFile($event.target.files)" accept=".txt">
        <v-btn x-small icon :disabled="MODE_HISTORICAL"
               @click="onResetFile"><v-icon>close</v-icon></v-btn>
      </v-flex>
      <v-flex xs3>
        <v-radio-group v-model="menuOption" row hide-details>
          <v-radio label="일괄출석" value="totally"></v-radio>
          <v-radio label="개별출석" value="manually"></v-radio>
          <v-radio label="출석처리 이력보기" value="historical"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs2 text-xs-right>
        <v-btn color="indigo accent-2" outline class="mb-3" :loading="confirmed === false"
               :disabled="attenders.length === 0 || menuOption === 'historical'"
               @click="onUpdateAutomation">출석 처리</v-btn>
        <span>전체 {{attenders.length|units}} {{MODE_HISTORICAL ? '건' : '명'}}</span>
      </v-flex>
    </v-layout>
    <v-layout class="mb-4" v-if="edu.type === 'E'">
      <v-flex xs8>
        <v-text-field label="교육 내용 및 주제"
                      clearable hide-details :disabled="MODE_HISTORICAL"
                      v-model="edu.memo"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center class="progress-circular" v-if="parsed === false">
      <v-progress-circular indeterminate color="#00b0f5"></v-progress-circular>
    </v-layout>

    <v-data-table :headers="headers"
                  :items="attenders" item-key="no"
                  :pagination.sync="pagination"
                  :rows-per-page-items="perPage"
                  class="mt-2">
      <template slot="items" slot-scope="props">
        <tr class="first-row" @click="onPopupList(props.item.ids)">
          <td class="text-xs-center">{{((pagination.page - 1) * pagination.rowsPerPage) + props.index + 1}}</td>
          <template v-if="MODE_HISTORICAL">
            <td class="text-xs-center">{{ props.item.stamp }}</td>
            <td class="text-xs-center">{{ props.item.edu_name }}</td>
            <td class="text-xs-center">{{ props.item.volt_name }}</td>
          </template>
          <template v-else>
            <td class="text-xs-center">{{ props.item.stamp }}</td>
            <td class="text-xs-center">{{ props.item.ca_id|caID }}</td>
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.ca_name }}</td>
            <td class="text-xs-center">{{ props.item.la_name }}</td>
            <td class="text-xs-center">{{ props.item.ma_name }}</td>
            <td class="text-xs-center">{{ props.item.sa_name }}</td>
            <td class="justify-center layout px-0">
              <v-icon small @click.self="onDeleteItem(props.index)">delete</v-icon>
            </td>
          </template>
        </tr>
        <tr v-if="MODE_MANUALLY && props.index >= attenders.length - 1">
          <td class="text-xs-center" colspan="10">
            <v-btn fab outline small color="cyan" slot="activator" @click.prevent="finder = true">
              <v-icon dark>add</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template slot="no-data">
        <v-alert :value="true" color="warning" icon="warning" v-if="parsed && MODE_TOTALLY">
          표시할 출석 정보가 없습니다.
        </v-alert>
        <tr v-if="MODE_MANUALLY">
          <td class="text-xs-center" colspan="10">
            <v-btn fab outline small color="cyan" slot="activator" @click.prevent="finder = true">
              <v-icon dark>add</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <people-dialog :visible="finder" @close-find-people="onFound"/>

    <v-dialog v-model="attenderDialog" scrollable persistent max-width="800px">
      <v-card>
        <v-card-title class="pl-4 pb-2 pt-4">교육 참석자 정보</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 600px" class="px-4">
          <v-data-table hide-headers hide-actions
                        :items="selectedAttenders" class="elevation-2">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-center">{{ props.item.ca_id }}</td>
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.ca_name }}</td>
                <td class="text-xs-center">{{ props.item.la_name }}</td>
                <td class="text-xs-center">{{ props.item.ma_name }}</td>
                <td class="text-xs-center">{{ props.item.sa_name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="mr-3 py-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" outline flat
                 @click="attenderDialog = false; selectedIds = []">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { map, find, filter, orderBy } from 'lodash/collection'
import { uniq } from 'lodash/array'
import { range } from 'lodash/util'
import { UPDATE_AUTOMATION, FETCH_AUTOMATION, FETCH_VOLUNTEERS } from '@/store/actions.type'
import PeopleDialog from '../components/control/FindPeopleDialog'

export default {
  name: 'Attenders',
  components: { PeopleDialog },
  data () {
    return {
      perPage: [50, 100, 200, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
      pagination: { sortBy: 'id', rowsPerPage: 100 },
      attenders: [],
      edu: {type: null, code: null, month: null, memo: null},
      menuOption: 'totally',
      finder: false,
      parsed: null,
      selected: null,
      confirmed: null,
      stat: {pass: 0, fail: 0},
      attenderDialog: false,
      selectedIds: []
    }
  },
  computed: {
    ...mapGetters(['eduCodes', 'volunteers']),
    MODE_MANUALLY () { return this.menuOption === 'manually' },
    MODE_TOTALLY () { return this.menuOption === 'totally' },
    MODE_HISTORICAL () { return this.menuOption === 'historical' },
    TYPE_EDU_MONTH () { return this.edu.code === 53 || this.edu.code === 57 },
    headerFields () {
      return this.MODE_HISTORICAL
        ? ['처리 날짜', '교육 항목', '출석 처리 인원']
        : ['인식 날짜', '고유 번호', '성명', '세례명', '교구', '지구', '본당']
    },
    contextFields () {
      return this.MODE_HISTORICAL
        ? ['stamp', 'edu_code', 'ids']
        : ['v_id', 'ca_id', 'name', 'ca_name', 'la_name', 'ma_name', 'sa_name']
    },
    headers () {
      const list = map(this.headerFields, (h, i) => ({text: h, value: this.contextFields[i], align: 'center', sortable: true}))
      list.unshift({text: '번호', value: 'no', align: 'center', sortable: false})
      if (!this.MODE_HISTORICAL) list.push({text: '삭제', value: 'edit', align: 'center', sortable: false})
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
      const mapped = map(filter(this.eduCodes, e => e.type === this.edu.type), e => {
        if (e.code === 53) e.name += ' (낮교육)'
        return e
      })
      return orderBy(mapped, ['name'])
    },
    months () {
      return range(1, 13)
    },
    selectedAttenders () {
      if (!this.selectedIds.length) return []
      return map(this.selectedIds.split(','), id => {
        const volt = find(this.volunteers, v => v.v_id === parseInt(id))
        return !volt ? {} : volt
      })
    }
  },
  watch: {
    menuOption (val) {
      this.onResetFile()

      if (val === 'historical') {
        this.parsed = false
        this.$store.dispatch(FETCH_AUTOMATION).then(data => {
          this.attenders = map(data, d => {
            const edu = find(this.eduCodes, e => e.code === d.edu_code)
            if (edu) d.edu_name = edu.name
            const ids = d.ids.split(',')
            const first = parseInt(ids[0])
            const volt = find(this.volunteers, v => v.v_id === first)
            if (volt) {
              d.volt_name = `${volt.name} ${volt.ca_name}`
              if (ids.length > 1) d.volt_name += ` 외 ${ids.length - 1}명`
            }
            return d
          })
        }).catch(() => alert('이력을 확인할 수 없습니다.'))
          .finally(() => (this.parsed = true))
      }
    }
  },
  async created () {
    const params = {unlimited: 1}
    this.$store.dispatch(FETCH_VOLUNTEERS, {params})
  },
  methods: {
    onHandleFile (files) {
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
    onResetFile () {
      const file = document.getElementById('txtFileInput')
      file.value = ''
      this.attenders = []
      this.edu = {type: null, code: null, month: null, memo: null}
    },
    loadHandler (event) {
      const file = event.target.result
      this.parsed = false
      this.confirmed = null

      const volts = uniq(file.split(/\r\n|\n/).filter(f => f).map(d => {
        const columns = d.split(/\t/)
        if (columns.length > 1) {
          return {id: columns[2].slice(4), date: columns[6]}
        } else {
          return {id: d.slice(2, 8)}
        }
      }))
      // console.log('parsed...', uniq(voltData), this.volunteers.length)
      try {
        let noMatches = ''
        for (const volt of volts) {
          if (!volt.id) continue
          const one = find(this.volunteers, d => d.ca_id === volt.id)
          if (one) this.attenders.push(Object.assign(one, {stamp: volt.date.replace(/\//g, '-')}))
          else noMatches += `${volt.id}, `
        }
        if (noMatches) throw new Error(noMatches)
      } catch (e) {
        alert(`일치되는 봉사자가 없습니다. ${e}`)
      } finally {
        this.parsed = true
      }
    },
    errorHandler (evt) {
      if (evt.target.error.name === 'NotReadableError') {
        alert('파일을 읽을 수 없습니다.!')
      }
      this.parsed = false
    },
    onUpdateAutomation () {
      if (!confirm('현재 리스트대로 출석 처리하시겠습니까?')) return
      if (!this.edu.code) return alert('교육 항목을 선택해주세요!')

      this.confirmed = false
      const now = new Date()
      const payload = {
        attenders: map(this.attenders, a => ({id: a.v_id, a_code: a.area_code})),
        year: now.getFullYear(),
        month: !this.edu.month ? now.getMonth() + 1 : this.edu.month,
        memo: this.edu.memo,
        edu_code: this.edu.code
      }

      this.$store.dispatch(UPDATE_AUTOMATION, payload).then(() => {
        alert('모두 출석 처리되었습니다.')
        this.menuOption = 'historical'
      }).finally(() => (this.confirmed = true))
    },
    onDeleteItem (index) {
      if (!confirm('선택한 항목을 삭제하시겠습니까?')) return
      this.attenders.splice(index, 1)
    },
    onFound (data) {
      if (data === undefined) { this.finder = false; return }
      const attender = {
        v_id: data.id,
        ca_id: data.ca_id,
        area_code: data.area_code,
        name: data.name,
        ca_name: data.ca_name,
        la_name: data.la_name,
        ma_name: data.ma_name,
        sa_name: data.sa_name
      }
      this.attenders.push(attender)
      this.finder = false
    },
    onPopupList (ids) {
      if (!this.MODE_HISTORICAL) return
      this.selectedIds = ids.slice()
      this.attenderDialog = true
    }
  },
  filters: {
    units (x) {
      if (!Number.isInteger(x) || Number.isNaN(x)) return x
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    caID (x) {
      if (!x) return '-'
      const s = x.slice(0, 2); const e = x.slice(2)
      return `${s}-${e}`
    }
  }
}
</script>
