<template>
  <div>
    <v-tooltip bottom>
      <v-btn fab outline dark small color="cyan" slot="activator">
        <v-icon dark>edit</v-icon>
      </v-btn>
      <span>수정</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small color="cyan" slot="activator">
        <v-icon dark>delete</v-icon>
      </v-btn>
      <span>삭제</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small color="cyan" slot="activator">
        <v-icon dark>add</v-icon>
      </v-btn>
      <span>추가</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'InlineButtons',
  props: {
  }
}
</script>

<style scoped>
</style>
