<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>My SCRAP</v-toolbar-title>
      <!--<v-divider class="mx-2" inset vertical></v-divider>-->
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
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
    <v-data-table :headers="headers" :items="scraps" class="elevation-1"
                  :pagination.sync="pagination" :rows-per-page-items="perPage"
                  item-key="name"><!--:loading="true" -->
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.author_id }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{ props.item.content }}</td>
        <td class="text-xs-center">{{ props.item.created|timestamp }}</td>
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
    <!--<div class="text-xs-center">
      <v-pagination v-model="page" :length="4" circle></v-pagination>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_SCRAPS, CREATE_SCRAP, UPDATE_SCRAP, DELETE_SCRAP } from '@/store/actions.type'
import DateFilter from '@/common/date.filter'
import ScrapItem from '@/components/ScrapItem'

const _ITEM = { id: '', author_id: '', title: '', content: '', created: '' }
export default {
  name: 'ScrapList',
  components: { ScrapItem },
  data: () => ({
    dialog: false,
    perPage: [10, 25, 50, 100, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
    pagination: {
      sortBy: 'name'
    },
    headers: [
      { text: 'Scrap ID', value: 'id', align: 'center' },
      { text: 'Author ID', value: 'author_id', align: 'center' },
      { text: 'Title', value: 'title', align: 'center' },
      { text: 'Content', value: 'content', align: 'center', sortable: false },
      { text: 'Created At', value: 'created', align: 'center' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedIndex: -1,
    editedItem: _ITEM,
    defaultItem: _ITEM
  }),
  computed: {
    ...mapGetters([
      'scrapsCount',
      'isScrapsLoading',
      'scrapItem'
    ]),
    scraps: {
      get () {
        return this.$store.state.scrap.scraps
      },
      set (value) {
        this.$store.dispatch(CREATE_SCRAP, value)
      }
    },
    listConfig () {
      return {}
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    // console.log(this.$store.state.scrap)
    this.fetchScraps()
  },
  methods: {
    fetchScraps () {
      this.$store.dispatch(FETCH_SCRAPS, this.listConfig)
    },
    initialize () {
    },
    editItem (item) {
      this.editedIndex = this.scraps.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.created = DateFilter(this.editedItem.created)
      this.dialog = true
    },
    deleteItem (item) {
      // const index = this.scraps.indexOf(item)
      // confirm('Are you sure you want to delete this item?') && this.scraps.splice(index, 1)
      confirm('Are you sure you want to delete this item?') && this.$store.dispatch(DELETE_SCRAP, item.id)
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
        // Object.assign(this.scraps[this.editedIndex], this.editedItem)
        this.$store.dispatch(UPDATE_SCRAP, {id: this.scraps[this.editedIndex].id, obj: this.editedItem})
      } else {
        this.scraps = this.editedItem
      }
      this.close()
    }
  }
}
</script>

<style scoped>
</style>
