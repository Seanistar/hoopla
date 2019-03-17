<template>
  <v-layout row pb-0>
    <v-flex xs6 v-if="au_year">
      <v-subheader class="body-2" >
        <span class="mr-3">선서연도 :</span>
        <span>{{au_year}} 년</span>
      </v-subheader>
    </v-flex>
    <v-flex xs6 v-if="v_name">
      <v-layout justify-end>
        <v-subheader class="body-2">
          <span class="mr-3">봉사자 :</span>
          <span>{{v_name}}</span>
        </v-subheader>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'InlineTextBox',
  props: [ 'au_year', 'v_name' ],
  data: () => ({
  })
}
</script>

<style scoped>
</style>
