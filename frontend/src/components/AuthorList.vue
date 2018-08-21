<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Author List</v-toolbar-title>
      <!--<v-divider class="mx-2" inset vertical></v-divider>-->
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Author</v-btn>
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
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="authors" class="elevation-1"
                  :pagination.sync="pagination" :rows-per-page-items="perPage"
                  item-key="id"><!--:loading="true" -->
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.perm }}</td>
        <td class="text-xs-center">{{ props.item.registered|toDate }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Sorry, nothing to display here :(
        </v-alert>
        <!--<v-btn color="primary" @click="initialize">Reset</v-btn>-->
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_AUTHORS, CREATE_AUTHOR, UPDATE_AUTHOR, DELETE_AUTHOR } from '@/store/actions.type'
import Moment from 'moment'
import ScrapItem from '@/components/ScrapItem'

const _ITEM = { id: '', name: '', perm: '', registered: '' }
export default {
  name: 'AuthorList',
  components: { ScrapItem },
  data: () => ({
    dialog: false,
    perPage: [10, 25, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
    pagination: {
      sortBy: 'id'
    },
    headers: [
      { text: 'Author ID', value: 'id', align: 'center' },
      { text: 'Name', value: 'name', align: 'center' },
      { text: 'Permission', value: 'perm', align: 'center', sortable: false },
      { text: 'Registered At', value: 'registered', align: 'center' },
      { text: 'Actions', value: 'name', align: 'center', sortable: false }
    ],
    editedIndex: -1,
    editedItem: _ITEM,
    defaultItem: _ITEM
  }),
  computed: {
    ...mapGetters([
      'authorsCount',
      'isAuthorsLoading'
    ]),
    authors: {
      get () {
        return this.$store.state.author.authors
      },
      set (value) {
        this.$store.dispatch(CREATE_AUTHOR, value)
      }
    },
    listConfig () {
      return {}
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Author' : 'Edit Author'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    // console.log(this.$store.state.scrap)
    this.fetchAuthors()
  },
  methods: {
    fetchAuthors () {
      this.$store.dispatch(FETCH_AUTHORS, this.listConfig)
    },
    initialize () {
    },
    editItem (item) {
      this.editedIndex = this.authors.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.created = new Date()
      this.dialog = true
    },
    deleteItem (item) {
      // const index = this.authors.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.authors.splice(index, 1)
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch(DELETE_AUTHOR, item.id)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        // Object.assign(this.authors[this.editedIndex], this.editedItem)
        this.$store.dispatch(UPDATE_AUTHOR, {id: this.authors[this.editedIndex].id, obj: this.editedItem})
      } else {
        this.authors = this.editedItem
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
