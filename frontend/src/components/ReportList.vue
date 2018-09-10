<template>
  <div class="pt-3">
    <v-container class="elevation-5" style="width: 85%">
      <v-layout row wrap pb-1 align-baseline>
        <v-flex xs12 sm3>
          <v-combobox label="소속 본당"
                      v-model="model" :items="items" item-value="code" item-text="name"
                      :search-input.sync="search" clearable
          >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    "<strong>{{ search }}</strong>" 본당이 없습니다. 관리자에게 문의해주세요.
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-combobox>
        </v-flex>
        <v-flex xs12 sm9>
          <v-layout justify-end>
            <v-btn color="deep-orange accent-2" outline dark class="mb-2" @click="deleteReport">보고 삭제</v-btn>
            <v-btn color="indigo accent-2" outline dark class="mb-2" @click="newReport">신규 보고</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-data-table :headers="headers" :items="foundVolunteers" hide-actions
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
            <td class="text-xs-center">{{ props.item.id }}</td>
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.ca_name }}</td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center">현황 내역이 없습니다.</div>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { map, find, orderBy } from 'lodash/collection'

export default {
  name: 'ReportList',
  computed: {
    ...mapGetters([
      'smallCodes',
      'adminInfo',
      'eduCodes',
      'isVolunteersLoading',
      'foundVolunteers',
      'foundCount'
    ])
  },
  watch: {
    model (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
    }
  },
  data: () => ({
    items: [],
    model: '',
    search: null,
    selected: {},
    headers: [
      { text: '작성 연도', value: 'year' },
      { text: '작성자', value: 'name' },
      { text: '연락처', value: 'phone' },
      { text: '작성일', value: 'date' },
      { text: '현황보고서', value: 'state' },
      { text: '명단리스트', value: 'volts' },
      { text: '봉사보고서', value: 'acts' }
    ]
  }),
  created () {
    const list = map(this.smallCodes, o => {
      return {code: o.s_code, name: o.s_name}
    })
    this.items = orderBy(list, ['name'])

    const res = find(list, o => o.code === this.adminInfo.area_code)
    if (res) this.model = res.name
  },
  methods: {
    newReport () {
      this.$router.push({name: 'edit-report'})
    },
    deleteReport () {
      if (!this.selected.id) return alert('삭제할 내역을 선택해주세요!')
      confirm('이 항목을 삭제하시겠습니까?')
    }
  }
}
</script>

<style scoped>
</style>
