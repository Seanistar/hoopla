<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title class="pl-4 pb-2">
          <v-text-field v-model="name" label="본당 이름 입력" clearable hint="이름을 입력하고 엔터키를 누르세요." @keyup.enter="findOne"></v-text-field>
          <v-btn slot="activator" color="primary" outline dark @click.stop="findOne">본당 찾기</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px" class="px-4">
            <v-data-table :headers="headers" :items="matches"
                          hide-actions no-data-text="이름을 입력하여 본당을 찾으세요." class="elevation-2">
              <template slot="headers" slot-scope="props">
                <tr>
                  <th v-for="header in props.headers" :key="header.text"
                    class="body-2 font-weight-regular align-center"
                  >{{ header.text }}
                  </th>
                </tr>
              </template>
              <v-progress-linear slot="progress" color="blue" indeterminate="finding"></v-progress-linear>
              <template slot="items" slot-scope="props">
                <tr @click="selected = props.item" :style="{backgroundColor: (selected.s_code === props.item.s_code ? 'orange' : 'unset')}">
                  <td class="text-xs-center">{{ props.item.s_code }}</td>
                  <td class="text-xs-center">{{ props.item.s_name }}</td>
                  <td class="text-xs-center">{{ props.item.m_name }}</td>
                  <td class="text-xs-center">{{ props.item.l_name }}</td>
                </tr>
              </template>
              <template slot="no-data" v-if="finding">
                <div class="text-xs-center">결과 내역이 없습니다.</div>
              </template>
            </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="mr-3 pt-3 pb-4">
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" outline flat
                 @click="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" outline flat
                 @click="closeDialog" :disabled="selected.s_code === undefined">설정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { filter } from 'lodash/collection'

export default {
  name: 'FindDialog',
  props: {
    visible: false
  },
  computed: {
    ...mapGetters([
      'smallCodes'
    ]),
    dialog: {
      get () { return this.visible },
      set () {
        this.reset()
        this.$emit('close-find-church')
      }
    }
  },
  data: () => ({
    selected: {},
    finding: false,
    matches: [],
    name: '',
    headers: [
      { text: '본당 코드', value: 's_code' },
      { text: '본당 이름', value: 's_name' },
      { text: '지구 이름', value: 'm_name' },
      { text: '교구 이름', value: 'l_name' }
    ]
  }),
  watch: {
    'item.name' () {
      this.finding = false
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-find-church', {data: this.selected})
      this.reset()
    },
    findOne () {
      if (!this.name) return alert('찾을 본당 이름을 입력하세요.')
      // if (this.name.length < 2) return alert('2자 이상 입력하세요.')

      setTimeout(() => {
        this.matches = filter(this.smallCodes, o => o.s_name.search(this.name) >= 0)
        this.finding = true
      }, 100)
    },
    reset () {
      this.name = ''
      this.selected = {}
      this.matches = []
      this.finding = false
    }
  }
}
</script>

<style scoped>
</style>
