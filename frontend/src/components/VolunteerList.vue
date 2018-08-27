<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>봉사자 리스트</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="indigo accent-2" outline dark class="mb-2" @click="newVolunteer">신규 봉사자</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="volunteers" class="elevation-1" dark
                  :pagination.sync="pagination" :rows-per-page-items="perPage"
                  item-key="id">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.ca_name }}</td>
        <td class="text-xs-center">{{ props.item.area_code }}</td>
        <td class="text-xs-center">{{ props.item.la_name }}</td>
        <td class="text-xs-center">{{ props.item.ma_name }}</td>
        <td class="text-xs-center">{{ props.item.sa_name }}</td>
        <td class="text-xs-center">{{ props.item.birth_date }}</td>
        <td class="text-xs-center">{{ props.item.ca_date }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          표시할 봉사자 정보가 없습니다.
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_VOLUNTEERS, CREATE_VOLUNTEER, UPDATE_VOLUNTEER, DELETE_VOLUNTEER } from '@/store/actions.type'

const _ITEM = { id: '', name: '', perm: '', registered: '' }
export default {
  name: 'VoltList',
  data: () => ({
    dialog: false,
    perPage: [10, 25, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
    pagination: {
      sortBy: 'id'
    },
    headers: [
      { text: 'ID', value: 'id', align: 'center' },
      { text: '성명', value: 'name', align: 'center' },
      { text: '세례명', value: 'caName', align: 'center', sortable: false },
      { text: '구역코드', value: 'areaCode', align: 'center' },
      { text: '소속교구', value: 'laName', align: 'center' },
      { text: '소속본당', value: 'maName', align: 'center' },
      { text: '소속지구', value: 'saName', align: 'center' },
      { text: '생년월일', value: 'birthDate', align: 'center' },
      { text: '세례일', value: 'caDate', align: 'center' },
      { text: '편집', value: 'action', align: 'center', sortable: false }
    ],
    editedIndex: -1,
    editedItem: _ITEM,
    defaultItem: _ITEM
  }),
  computed: {
    ...mapGetters([
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
    formTitle () {
      return this.editedIndex === -1 ? '봉사자 추가' : '봉사자 수정'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    this.fetchVolunteers()
  },
  methods: {
    fetchVolunteers () {
      this.$store.dispatch(FETCH_VOLUNTEERS)
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
