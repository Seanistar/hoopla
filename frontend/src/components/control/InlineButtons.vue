<template>
  <div class="fl-r tp-10">
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$eventBus.$emit(`click-btn-${refs}`, 'edit')"
      >
        <v-icon dark>edit</v-icon>
      </v-btn>
      <span>수정</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$eventBus.$emit(`click-btn-${refs}`, 'remove')"
      >
        <v-icon dark>delete</v-icon>
      </v-btn>
      <span>삭제</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline dark small
             color="cyan" slot="activator"
             @click.prevent="$eventBus.$emit(`click-btn-${refs}`, 'add')"
      >
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
    refs: ''
  }
}
</script>

<style scoped>
</style>
