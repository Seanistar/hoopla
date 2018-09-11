<template>
  <v-container class="elevation-5" style="width: 85%">
    <v-layout row align-end pb-2>
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
          <v-btn color="indigo accent-2" outline dark class="mb-3" @click="newVolunteer">신규 봉사자</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-data-table :headers="headers" :items="volunteers" class="elevation-5"
                  :pagination.sync="pagination" :rows-per-page-items="perPage" rows-per-page-text="페이지 당 보기 개수"
                  item-key="id" :loading="isVolunteersLoading && !fetched"
    >
      <template slot="headers" slot-scope="props">
        <tr>
          <th v-for="header in props.headers" :key="header.text"
              class="body-1 font-weight-regular align-center"
          >{{ header.text }}
          </th>
        </tr>
      </template>
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.ca_name }}</td>
          <td class="text-xs-center">{{ activityState[props.item.state] }}</td>
          <td class="text-xs-center">{{ props.item.la_name }}</td>
          <td class="text-xs-center">{{ props.item.ma_name }}</td>
          <td class="text-xs-center">{{ props.item.sa_name }}</td>
          <td class="text-xs-center">{{ props.item.au_date }}</td>
          <td class="text-xs-center">{{ props.item.ca_date }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{pageStart, pageStop, itemsLength}">
        전체 {{itemsLength}}개 중 {{ pageStart }} ~ {{ pageStop }}
      </template>
      <template slot="no-data" v-if="fetched">
        <v-alert :value="true" color="warning" icon="warning">
          표시할 봉사자 정보가 없습니다.
        </v-alert>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_VOLUNTEERS, CREATE_VOLUNTEER, UPDATE_VOLUNTEER, DELETE_VOLUNTEER } from '@/store/actions.type'
import { map, find, orderBy } from 'lodash/collection'

export default {
  name: 'VoltList',
  data: () => ({
    items: [],
    model: '',
    search: null,
    dialog: false,
    fetched: false,
    perPage: [10, 25, {text: '$vuetify.dataIterator.rowsPerPageAll', value: -1}],
    pagination: { sortBy: 'id' },
    headers: [
      { text: 'ID', value: 'id' },
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'caName', sortable: false },
      { text: '활동상태', value: 'areaCode' },
      { text: '소속교구', value: 'laName' },
      { text: '소속지구', value: 'maName' },
      { text: '소속본당', value: 'saName' },
      { text: '선서일', value: 'authDate' },
      { text: '세례일', value: 'caDate' },
      { text: '편집', value: 'edit', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {},
    defaultItem: { id: null, name: '' }
  }),
  computed: {
    ...mapGetters([
      'smallCodes',
      'adminInfo',
      'volunteersCount',
      'isVolunteersLoading'
    ]),
    volunteers: {
      get () {
        return this.$store.state.volunteer.volunteers
      },
      set (value) {
        this.$store.dispatch(CREATE_VOLUNTEER, value)
      }
    },
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망' }
    },
    formTitle () {
      return this.editedIndex === -1 ? '봉사자 추가' : '봉사자 수정'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    model (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
    }
  },
  created () {
    const list = map(this.smallCodes, o => {
      return {code: o.s_code, name: o.s_name}
    })
    this.items = orderBy(list, ['name'])

    const res = find(list, o => o.code === this.adminInfo.area_code)
    if (res) this.model = res.name
  },
  mounted () {
    this.fetchVolunteers()
  },
  methods: {
    async fetchVolunteers () {
      await this.$store.dispatch(FETCH_VOLUNTEERS)
      this.fetched = true
    },
    newVolunteer () {
      this.$router.push({name: 'new-volunteer'})
    },
    editItem (item) {
      this.$router.push({name: 'edit-volunteer', params: {id: item.id, item: item}})
    },
    deleteItem (item) {
      confirm('이 항목을 삭제하시겠습니까?') && this.$store.dispatch(DELETE_VOLUNTEER, item.id)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 10)
    },
    save () {
      if (this.editedIndex > -1) {
        this.$store.dispatch(UPDATE_VOLUNTEER, this.editedItem)
      } else {
        this.volunteers = this.editedItem
      }
      this.close()
    }
  }
}
</script>

<style scoped>
</style>
