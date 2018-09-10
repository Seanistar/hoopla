<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable persistent max-width="800px">
      <v-card>
        <v-card-title class="pl-4 pb-2">
          <v-text-field v-model="name" label="봉사자 이름 입력" autofocus clearable hint="정확한 실명을 입력하고 엔터키를 누르세요." @keyup.enter="findOne"></v-text-field>
          <v-btn slot="activator" color="primary" outline dark @click.stop="findOne">봉사자 찾기</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px" class="px-4">
            <v-data-table :headers="headers" :items="foundVolunteers" :loading="isVolunteersLoading && found"
                          hide-actions no-data-text="이름을 입력하여 봉사자를 찾으세요." class="elevation-2">
              <template slot="headers" slot-scope="props">
                <tr>
                  <th v-for="header in props.headers" :key="header.text"
                    class="body-2 font-weight-regular align-center"
                  >{{ header.text }}
                  </th>
                </tr>
              </template>
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <tr @click="selected = props.item" :style="{backgroundColor: (selected.id === props.item.id ? 'orange' : 'unset')}">
                  <td class="text-xs-center">{{ props.item.name }}</td>
                  <td class="text-xs-center">{{ props.item.ca_name }}</td>
                  <td class="text-xs-center">{{ props.item.sa_name }}</td>
                  <td class="text-xs-center">{{ activityState[props.item.state] }}</td>
                  <td class="text-xs-center">{{props.item.br_date}}</td>
                </tr>
              </template>
              <template slot="no-data" v-if="found">
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
                 @click="closeDialog" :disabled="selected.id === undefined">설정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { FIND_VOLUNTEERS } from '@/store/actions.type'
import { mapGetters } from 'vuex'
import { RESET_FIND_VOLUNTEERS } from '@/store/mutations.type'

export default {
  name: 'FindDialog',
  props: {
    visible: false
  },
  computed: {
    ...mapGetters([
      'isVolunteersLoading',
      'foundCount',
      'foundVolunteers'
    ]),
    dialog: {
      get () { return this.visible },
      set () {
        this.reset()
        this.$emit('close-find-people')
      }
    },
    activityState () {
      return { ACT: '활동중', STP: '중단', BRK: '쉼', DTH: '사망' }
    }
  },
  data: () => ({
    selected: {},
    found: false,
    name: '',
    headers: [
      { text: '성명', value: 'name' },
      { text: '세례명', value: 'caName' },
      { text: '본당명', value: 'saName' },
      { text: '활동상태', value: 'state' },
      { text: '생년월일', value: 'brDate' }
    ]
  }),
  watch: {
    'item.name' () {
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-find-people', this.selected)
      this.reset()
    },
    async findOne () {
      if (!this.name) return alert('찾을 봉사자 이름을 입력하세요.')
      // if (this.name.length < 2) return alert('2자 이상 입력하세요.')

      await this.$store.dispatch(FIND_VOLUNTEERS, {name: this.name})
      this.found = true
    },
    reset () {
      this.name = ''
      this.selected = {}
      this.found = false
      this.$store.commit(RESET_FIND_VOLUNTEERS)
    }
  }
}
</script>

<style scoped>
</style>
