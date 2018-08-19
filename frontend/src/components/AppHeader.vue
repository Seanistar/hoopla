<template>
  <div>
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>SCRAPBOOK</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-tabs slot="extension" v-model="tab" color="cyan" grow>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="(item, index) in items" :key="index" @click="onSelect(item.link)">
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <!--<v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, idx) in items" :key="idx">
        <v-card flat>
          <v-card-text>{{ content }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>-->
  </div>
</template>

<script>

export default {
  name: 'Header',
  data () {
    return {
      title: '',
      tab: null,
      items: [
        {text: 'home', link: 'home'},
        {text: 'scrap', link: 'scraps'},
        {text: 'author', link: '/author'},
        {text: 'setting', link: '/topic'},
        {text: 'news', link: 'home-topic'}
      ],
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  methods: {
    onSelect (link) {
      console.log('select ' + link)
      this.$router.push({name: link})
    }
  }
}
</script>

<style scoped>
  .header {
    padding: 15px 0;
  }
</style>
