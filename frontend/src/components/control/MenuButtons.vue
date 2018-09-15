<template>
  <v-layout justify-end pt-0>
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$emit(`click-menu`, 'edit')"
      >
        <v-icon dark>edit</v-icon>
      </v-btn>
      <span>수정</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$emit(`click-menu`, 'remove')"
      >
        <v-icon dark>delete</v-icon>
      </v-btn>
      <span>삭제</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$emit(`click-menu`, 'add')"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
      <span>추가</span>
    </v-tooltip>
  </v-layout>
</template>

<script>
export default {
  name: 'MenuButtons',
  props: {
    refs: ''
  }
}
</script>

<style scoped>
</style>
