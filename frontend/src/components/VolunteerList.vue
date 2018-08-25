<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>봉사자 리스트</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="indigo accent-2" outline dark class="mb-2" @click="newVolunteer">신규 봉사자</v-btn>
      <!--<v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.id" label="Scrap ID" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.author_id" label="Author ID"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.content" label="Content"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.created" label="Created At" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>-->
    </v-toolbar>
    <v-data-table :headers="headers" :items="volunteers" class="elevation-1" dark
                  :pagination.sync="pagination" :rows-per-page-items="perPage"
                  item-key="id">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.ca_name }}</td>
        <td class="text-xs-center">{{ props.item.la_code }}</td>
        <td class="text-xs-center">{{ props.item.ma_code }}</td>
        <td class="text-xs-center">{{ props.item.sa_code }}</td>
        <td class="text-xs-center">{{ props.item.birth_date|toDate }}</td>
        <td class="text-xs-center">{{ props.item.ca_date|toDate }}</td>
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
import Moment from 'moment'

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
      { text: '소속 교구', value: 'laName', align: 'center' },
      { text: '소속 본당', value: 'maName', align: 'center' },
      { text: '소속 지구', value: 'saName', align: 'center' },
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
      return this.editedIndex === -1 ? 'New Volunteer' : 'Edit Volunteer'
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
      this.$router.push({name: 'edit-volunteer', params: {volt: item, id: item.id}})
    },
    deleteItem (item) {
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch(DELETE_VOLUNTEER, item.id)
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
        this.$store.dispatch(UPDATE_VOLUNTEER, {id: this.volunteers[this.editedIndex].id, obj: this.editedItem})
      } else {
        this.volunteers = this.editedItem
      }
      this.close()
    }
  },
  filters: {
    toDate (val) {
      return Moment(val).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
</style>
