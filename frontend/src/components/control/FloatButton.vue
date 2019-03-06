<template>
  <v-tooltip bottom>
    <v-btn class="v-btn--floating back-float" @click="moveToList"
           outline slot="activator" color="cyan">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <span>리스트로 이동</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'FloatButton',
  props: ['path'],
  methods: {
    moveToList () {
      this.$router.replace({name: this.path})
    }
  }
}
</script>

<style scoped>
  .back-float {
    position: fixed !important;
    top: 45%;
    left: 10px;
  }
</style>
