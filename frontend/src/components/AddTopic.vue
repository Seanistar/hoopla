<template>
  <div>
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title">Add Topic</span>
      </md-app-toolbar>

      <md-app-content>
        <md-field>
          <label>Title</label>
          <md-input v-model="title" placeholder="type TITLE here!"></md-input>
        </md-field>

        <md-field>
          <label>Author</label>
          <md-input v-model="type"></md-input>
          <!--<span class="md-helper-text">Helper text</span>-->
        </md-field>

        <md-field>
          <label>Author ID</label>
          <md-input v-model="authorId" type="number"></md-input>
        </md-field>

        <md-field>
          <label>Content</label>
          <md-textarea v-model="content" md-autogrow placeholder="type CONTENT here what you want to write!"></md-textarea>
        </md-field>
      </md-app-content>
    </md-app>
    <md-button class="md-raised md-primary" @click="addTopic">ADD</md-button>
  </div>
</template>

<script>
import Vue from 'vue'
import TopicService from '@/services/TopicService'
import { MdField } from 'vue-material/dist/components'

Vue.use(MdField)
export default {
  name: 'AddTopic',
  data: () => ({
    title: '',
    type: null,
    authorId: null,
    content: '',
    disabled: null
  }),
  methods: {
    async addTopic () {
      const param = {
        title: this.title,
        content: this.content
      }
      const response = await TopicService.addTopicInfo(param)
      console.log(response.data)
      this.$router.push({name: 'topics'})
    }
  }
}
</script>

<style scoped>
</style>
