<template>
  <div>
    <md-table v-model="authors" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <h1 class="md-title">AUTHORS</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <!--<md-table-cell md-label="Content" md-sort-by="content">{{ item.content }}</md-table-cell>
        <md-table-cell md-label="Created" md-sort-by="created">{{ item.created }}</md-table-cell> -->
        <md-table-cell md-label="Permission">{{ item.perm }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-button class="md-dense md-raised md-primary">Join</md-button>
  </div>
</template>

<script>
import Vue from 'vue'
import AuthorService from '@/services/AuthorService'
import { MdTable, MdCard, MdContent, MdRipple, MdTabs, MdIcon, MdButton } from 'vue-material/dist/components'

Vue.use(MdTable)
Vue.use(MdCard)
Vue.use(MdContent)
Vue.use(MdRipple)
Vue.use(MdTabs)
Vue.use(MdIcon)
Vue.use(MdButton)

export default {
  name: 'Authors',
  data () {
    return {
      authors: []
    }
  },
  created () {
    this.getAuthors()
  },
  methods: {
    async getAuthors () {
      const response = await AuthorService.getAuthors()
      // console.log(response.data)
      this.authors = response.data
    }
  }
}
</script>

<style scoped>
</style>
