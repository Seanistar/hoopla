<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Topic Page - {{page.title}}</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" v-if= "false">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>
        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>
          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>
          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>
          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <p style="text-align: left">{{page.content}}</p>
        <p style="text-align: right">{{page.created|timestamp}}</p>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Vue from 'vue'
import TopicService from '@/services/topic.service'
import Moment from 'moment'
import { MdApp, MdToolbar, MdList, MdDrawer, MdContent }
  from 'vue-material/dist/components'

Vue.use(MdApp)
Vue.use(MdToolbar)
Vue.use(MdList)
Vue.use(MdDrawer)
Vue.use(MdContent)

export default {
  name: 'TopicPage',
  data () {
    return {
      page: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // console.log(vm.id = to.params.id)
      vm.getTopicPage(to.params.id)
    })
  },
  methods: {
    async getTopicPage (id) {
      if (id === 0) return console.warn('no id')
      const response = await TopicService.getTopicPage(id)
      // console.log(response.data)
      this.page = response.data[0]
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
  .md-app {
    max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
