<template>
  <div>
    <md-field>
      <label>Topic's ID</label>
      <md-input v-model="page.id" readonly></md-input>
      <span class="md-helper-text">auto ranked ID</span>
    </md-field>

    <md-field>
      <label>Topic's Title</label>
      <md-input v-model="page.title"></md-input>
    </md-field>

    <md-field>
      <label>Created Date</label>
      <md-input v-model="page.created" readonly></md-input>
    </md-field>

    <md-field>
      <label>Topic's Author ID</label>
      <md-input v-model="page.author_id" type="number"></md-input>
    </md-field>

    <md-field>
      <label>Topic's Content</label>
      <md-textarea v-model="page.content"></md-textarea>
    </md-field>

    <md-field>
      <label>Textarea with Autogrow</label>
      <md-textarea md-autogrow></md-textarea>
    </md-field>

    <md-button class="md-raised" @click="$router.back()">CANCEL</md-button>
    <md-button class="md-raised md-primary" @click="editTopic">DONE</md-button>
  </div>
</template>

<script>
import TopicService from '@/services/topic.service'
import CommonFilter from '../common/date.filter'

export default {
  name: 'EditTopic',
  data: () => ({
    page: {}
  }),
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
      // console.log(response.data[0])
      this.page = response.data[0]
      this.page.created = CommonFilter['timestamp'](this.page.created)
    },
    async editTopic () {
      // console.log(this.page)
      const response = await TopicService.editTopicInfo(this.page.id, this.page)
      console.log(response.data)
      this.$router.push({name: 'topics'})
    }
  },
  filters: {
    timestamp (val) {
      return CommonFilter['timestamp'](val)
    }
  }
}
</script>

<style scoped>
</style>
