<template>
  <div>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header @md-selected="onSelect">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">TOPICS</h1>
        </div>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by title..." v-model="search" @input="onSearch(topics, search)" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state v-if="false"
        md-label="No topics found"
        :md-description="`No topics found for this '${search}' query. Try a different search term or create a new topic.`">
        <md-button class="md-primary md-raised" @click="onAddTopic">Create New Topic</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Title" md-sort-by="title">{{ item.title }}</md-table-cell>
        <md-table-cell md-label="Content" md-sort-by="content">{{ item.content }}</md-table-cell>
        <md-table-cell md-label="Created" md-sort-by="created">{{ item.created|timestamp}}</md-table-cell>
        <md-table-cell md-label="Author ID">{{ item.author_id }}</md-table-cell>
      </md-table-row>
    </md-table>

    <div class="button-container">
      <md-button class="md-fab md-primary" @click="onAddTopic">
        <md-icon>add</md-icon>
      </md-button>
      <md-button class="md-fab md-plain" @click="onEditTopic">
        <md-icon>edit</md-icon>
      </md-button>
    </div>
    <!--<p>Selected:</p>{{ selected }}-->
  </div>
</template>

<script>
import Vue from 'vue'
import Moment from 'moment'
import TopicService from '@/services/TopicService'
import { MdTable, MdCard, MdContent, MdRipple, MdButton, MdEmptyState, MdField }
  from 'vue-material/dist/components'

Vue.use(MdTable)
Vue.use(MdCard)
Vue.use(MdContent)
Vue.use(MdRipple)
Vue.use(MdButton)
Vue.use(MdEmptyState)
Vue.use(MdField)

const toLower = text => text.toString().toLowerCase()

export default {
  name: 'Topics',
  data () {
    return {
      search: null,
      searched: [],
      selected: {},
      topics: []
    }
  },
  created () {
    // this.getTopics()
    this.$http.get('/api/topics')
      .then((response) => {
        this.searched = this.topics = response.data
      })
  },
  mounted () {
    setTimeout(() => {
      const heads = document.getElementsByClassName('md-table-head')
      console.log(heads.length)
      for (let i = 0; i < heads.length; i++) {
        heads[i].style.textAlign = 'center'
      }
    }, 200)
  },
  methods: {
    async getTopics () {
      const response = await TopicService.getTopics()
      // console.log(response.data)
      this.searched = this.topics = response.data
    },
    getClass: ({ id }) => ({
      'md-primary': id === 2,
      'md-accent': id === 3
    }),
    onSelect (item) {
      this.selected = item
      this.$router.push({
        name: 'topic-page',
        params: {id: item.id}
      })
    },
    onAddTopic () {
      this.$router.push({name: 'add-topic'})
    },
    onEditTopic () {
      this.$router.push({name: 'edit-topic'})
    },
    onSearch (items, term) {
      if (term) {
        this.searched = items.filter(item => toLower(item.title).includes(toLower(term)))
        return
      }
      this.searched = items
    }
  },
  filters: {
    timestamp (val) {
      return Moment(val).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-table + .md-table {
    margin-top: 16px
  }
  .md-field {
    max-width: 15vw;
  }
  .md-toolbar-section-start {
    text-align: left
  }
  .button-container {
    text-align: right;
    margin-top: 15px
  }
</style>
