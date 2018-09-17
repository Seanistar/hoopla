<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{title}}</v-card-title>
        <v-card-text>{{msg}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog = false">취소</v-btn>
          <v-btn color="green darken-1" flat @click.native="dialog = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'AppConfirm',
  data: () => ({
    dialog: false,
    title: '',
    msg: '',
    onResult: null
  }),
  methods: {
    show (title, msg, cb) {
      this.title = title
      this.msg = msg
      this.onResult = cb
      this.dialog = true
    },
    close (res) {
      this.dialog = false
      if (typeof this.onResult === 'function') {
        this.onResult(res)
      }
    }
  }
}
</script>

<style scoped>
</style>
