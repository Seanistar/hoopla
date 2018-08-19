<template>
  <!--<div>
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

      <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item.author_id)" md-selectable="single">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Title" md-sort-by="title">{{ item.title }}</md-table-cell>
        <md-table-cell md-label="Content" md-sort-by="content">{{ item.content }}</md-table-cell>
        <md-table-cell md-label="Created" md-sort-by="created">{{ item.created|timestamp}}</md-table-cell>
        <md-table-cell md-label="Author ID">{{ item.author_id }}</md-table-cell>
      </md-table-row>
    </md-table>

    <div class="button-container">
      <p style="float: left">{{ selected }}</p>
      <md-button class="md-fab md-accent" @click="onDeleteTopic">
        <md-icon>delete</md-icon>
      </md-button>
      <md-button class="md-fab md-primary" @click="onAddTopic">
        <md-icon>add</md-icon>
      </md-button>
      <md-button class="md-fab md-normal" @click="onEditTopic">
        <md-icon>edit</md-icon>
      </md-button>
    </div>
  </div>-->
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ TOPICS }}</h1>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <!--<div v-html="parseMarkdown(article.body)"></div>-->
          <ul class="tag-list">
            <li
              v-for="(tag, index) of article.tagList"
              :key="tag + index">
              <!--<RwvTag :name="tag" className="tag-default tag-pill tag-outline"></RwvTag>-->
            </li>
          </ul>
        </div>
      </div>
      <hr/>
      <!--<div class="article-actions">
        <RwvArticleMeta
          :article="article"
          :actions="true"
        ></RwvArticleMeta>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <RwvCommentEditor
            v-if="isAuthenticated"
            :slug="slug"
            :userImage="currentUser.image">
          </RwvCommentEditor>
          <p v-else>
            <router-link :to="{name: 'login'}">Sign in</router-link>
            or
            <router-link :to="{ name: 'register' }">sign up</router-link>
            to add comments on this article.
          </p>
          <RwvComment
            v-for="(comment, index) in comments"
            :slug="slug"
            :comment="comment"
            :key="index">
          </RwvComment>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import Moment from 'moment'
import { includes } from 'lodash'
import TopicService from '@/common/api.service'
// import { MdTable, MdCard, MdContent, MdRipple, MdButton, MdEmptyState, MdField } from 'vue-material/dist/components'

/* Vue.use(MdTable)
Vue.use(MdCard)
Vue.use(MdContent)
Vue.use(MdRipple)
Vue.use(MdButton)
Vue.use(MdEmptyState)
Vue.use(MdField) */

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
    this.getTopics()
    /* this.$http.get('/api/topics')
      .then((response) => {
        this.searched = this.topics = response.data
        console.log(this.searched)
      }) */
  },
  mounted () {
    setTimeout(() => {
      const heads = document.getElementsByClassName('md-table-head')
      // console.log(heads.length)
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
    getClass: (authorID) => ({
      'md-primary': true,
      'md-accent': authorID === null
    }),
    onSelect (item) {
      this.selected = item
      // this.$router.push({name: 'topic-page', params: {id: item.id}})
    },
    onAddTopic () {
      this.$router.push({name: 'add-topic'})
    },
    onEditTopic () {
      this.$router.push({name: 'edit-topic', params: {id: this.selected.id}})
    },
    onDeleteTopic () {
      if (!confirm('delete selected topic?')) return
      TopicService.deleteTopic(this.selected.id)
        .then((res) => {
          console.log(res.data)
          window.reload()
        })
    },
    onSearch (items, term) {
      if (term) {
        // this.searched = items.filter(item => toLower(item.title).includes(toLower(term)))
        this.searched = items.filter(item => includes(toLower(item.title), toLower(term)))
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
  .md-normal {
    background-color: limegreen !important;
  }
</style>
