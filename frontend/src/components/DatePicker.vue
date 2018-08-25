<template>
  <div>
    <v-menu
      ref="menu"
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="date"
        :label="title"
        hint="년-월-일 형식"
        prepend-icon="event"
        readonly
      ></v-text-field>
      <v-date-picker ref="picker" v-model="date"
                     no-title locale="ko-kr" :show-current="false"
                     :max="new Date().toISOString().substr(0, 10)"
                     min="1918-01-01"
      >
        <v-spacer></v-spacer>
        <v-btn flat outline color="primary" @click="date = ''; menu = false">취소</v-btn>
        <v-btn flat outline color="primary" @click="save">확인</v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    title: '',
    refs: ''
  },
  data: () => ({
    date: null,
    menu: false
  }),
  watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save () {
      this.$refs.menu.save(this.date)
      this.$eventBus.$emit('close-date-picker', {refs: this.refs, date: this.date})
    },
    reset () {
      this.date = null
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
</style>
