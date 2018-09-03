<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>

        <v-card-text>
         <v-container grid-list-md v-if="refs === 'edu'">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="item.id" label="교육 ID" disabled></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.edu_name" label="교육 내용"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="s_date" refs="edu-s_date" title="교육 시작일"
                ></date-picker>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="e_date" refs="edu-e_date" title="교육 종료일"
                ></date-picker>
              </v-flex>
              <!--<v-flex xs12>
                <v-text-field v-model="item.sv_ids" label="봉사자"></v-text-field>
              </v-flex>-->
              <v-flex xs12>
                <v-text-field v-model="item.desc" label="참고 사항"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
         <v-container grid-list-md v-if="refs === 'act'">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="item.id" label="봉사활동 ID" disabled></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.grp_name" label="그룹봉사 단체"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="s_date" refs="act-s_date" title="봉사 시작일"
                ></date-picker>
              </v-flex>
              <v-flex xs12 sm6>
                <date-picker ref="e_date" refs="act-e_date" title="봉사 종료일"
                ></date-picker>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.content" label="봉사활동 내용"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container grid-list-md v-if="refs === 'code'">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="item.code" label="구역 코드" readonly></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="item.name" label="구역 이름"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" outline flat
                 @click="$eventBus.$emit(`click-dlg-${refs}`, {type: 'cancel'})">취소</v-btn>
          <v-btn color="blue darken-1" outline flat
                 @click="$eventBus.$emit(`click-dlg-${refs}`, {type: 'save', data: item})">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import DatePicker from './DatePicker'
import DateFilter from '@/common/date.filter'

export default {
  name: 'InputDialog',
  components: { DatePicker },
  props: {
    title: '',
    refs: {
      type: String,
      required: true,
      default: ''
    }
  },
  data: () => ({
    dialog: false,
    item: {}
  }),
  watch: {
    'item.id' () {
      Object.keys(this.item).forEach(k => {
        const pos = k.indexOf('_date')
        if (pos > 0) {
          this.$refs[k].date = DateFilter['datestamp'](this.item[k])
        }
      })
    }
  },
  created () {
    const _this = this
    this.$eventBus.$on('close-date-picker', (obj) => {
      console.info(obj.refs, _this.params[obj.refs] = obj.date)
    })
  },
  methods: {
    showDialog (val) {
      this.dialog = val
    },
    setItem (obj) {
      Object.keys(obj).forEach(k => {
        this.item[k] = obj[k]
      })
    }
  }
}
</script>

<style scoped>
</style>
