<template>
  <div>
    <v-alert
      value="show"
      :color="type"
      :icon="icon"
      outline
      dismissible
    >
      {{ message }}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'AppAlert',
  props: {
    message: '',
    alert: false,
    type: {type: String, default: 'success'}
  },
  data: () => ({
    icon: 'check_circle',
    show: true
  }),
  created () {
    if (this.type === 'info') this.icon = 'info'
    else if (this.type === 'warning') this.icon = 'priority_high'
    else if (this.type === 'error') this.icon = 'warning'
  }
}
</script>

<style scoped>
</style>
