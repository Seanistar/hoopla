<template>
  <v-layout row pb-0>
    <v-flex xs6>
      <v-subheader class="body-2">
        <span class="mr-3">선서연도 :</span>
        <span>{{au_year}} 년</span>
      </v-subheader>
    </v-flex>
    <v-flex xs6>
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
  props: {
    au_year: { default: '2014' },
    v_name: { default: '김성휘 사도요한' }
  },
  data: () => ({
  })
}
</script>

<style scoped>
</style>
