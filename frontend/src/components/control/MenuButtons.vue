<template>
  <v-layout justify-end pt-0>
    <v-tooltip bottom>
      <v-btn fab outline small v-if="!menu || (menu && menu.includes('edit'))"
             color="cyan" slot="activator" :disabled="disabled"
             @click.prevent="$emit(`click-menu`, 'edit')"
      >
        <v-icon dark>edit</v-icon>
      </v-btn>
      <span>수정</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline small v-if="!menu || (menu && menu.includes('remove'))"
             color="cyan" slot="activator" :disabled="disabled"
             @click.prevent="$emit(`click-menu`, 'remove')"
      >
        <v-icon dark>delete</v-icon>
      </v-btn>
      <span>삭제</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn fab outline small v-if="!menu || (menu && menu.includes('add'))"
             color="cyan" slot="activator" :disabled="disabled"
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
    refs: '',
    menu: null,
    disabled: false
  }
}
</script>

<style scoped>
</style>
