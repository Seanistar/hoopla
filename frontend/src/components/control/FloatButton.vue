<template>
  <v-tooltip bottom>
    <v-btn class="v-btn--floating back-float" @click="$router.back()"
           outline slot="activator" color="cyan">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <span>리스트로 이동</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'FloatButton',
  props: {
    refs: ''
  }
}
</script>

<style scoped>
  .back-float {
    position: fixed;
    top: 45%;
    left: 20px;
  }
</style>
