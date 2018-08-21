<template>
  <div>
    <v-text-field label="Hello to ScrapBook"></v-text-field>
    <v-jumbotron :gradient="gradient" dark>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Welcome to the site</h3>
            <span class="subheading">Lorem ipsum dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>
            <v-divider class="my-3"></v-divider>
            <div class="title mb-3">Check out our newest features!</div>
            <v-btn class="mx-0" color="deep-purple accent-2" large>Login</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'HelloHome',
  data: () => ({
    gradient: 'to top, #7B1FA2, #E1BEE7'
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
