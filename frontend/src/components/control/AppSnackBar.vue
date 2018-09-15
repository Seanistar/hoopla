<template>
  <v-snackbar
    v-model="snackBar"
    :bottom="y === 'bottom'"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ text }}
    <v-btn
      color="pink"
      flat
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'AppSnackBar',
  data () {
    return {
      snackBar: false,
      y: 'top',
      x: null,
      mode: '',
      timeout: 3000,
      text: 'Hello, I\'m a snackbar'
    }
  },
  methods: {
    show (msg) {
      this.snackBar = true
      this.text = msg
    }
  }
}
</script>

<style scoped>
</style>
