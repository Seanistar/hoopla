<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-spacer></v-spacer>
        <v-list three-line>
          <template v-for="(item) in topics">
            <!--<v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>-->
            <v-list-tile :key="item.title" avatar @click="onSelect(item.id)">
              <!--<v-list-tile-avatar>
                <img :src="item.avatar">
              </v-list-tile-avatar>-->
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.content"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  <!--<div>
    <div v-if="isLoading" class="article-preview">
      Loading articles...
    </div>
    <div v-else>
      <div v-if="topics.length === 0" class="article-preview">
        No articles are here... yet.
      </div>
      <topic-preview
        v-for="(topic, index) in topics"
        :topic="topic"
        :key="topic.title + index">
      </topic-preview>
      &lt;!&ndash;<v-pagination
        :pages="pages"
        :currentPage.sync="currentPage"
      ></v-pagination>&ndash;&gt;
    </div>
  </div>-->
</template>

<script>
import { mapGetters } from 'vuex'
import { FETCH_TOPICS } from '@/store/actions.type'
import TopicPreview from '@/components/TopicPreview'

export default {
  name: 'TopicList',
  components: { TopicPreview },
  computed: {
    ...mapGetters([
      'topicsCount',
      'isTopicsLoading',
      'topics'
    ]),
    listConfig () {
      return {}
    }
  },
  mounted () {
    this.fetchTopics()
  },
  methods: {
    fetchTopics () {
      this.$store.dispatch(FETCH_TOPICS, this.listConfig)
    },
    onSelect (id) {
      console.log('select ' + id)
    }
  }
}
</script>

<style scoped>
</style>
