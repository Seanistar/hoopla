<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4" v-model="tabIdx">
      <v-tab v-for="(item, idx) in title" :key="idx"
             @click="tabIdx = idx" :disabled="v_id === undefined && idx !== 0">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <component :is="targetComponents[tabIdx]" :v_id.sync="v_id">
        <span slot="voltInfo" class="mr-3">봉사자 :
          <span>{{voltInfo.name}} {{voltInfo.ca_name}} ({{voltInfo.sa_name}} 본당)</span>
          <!--<inline-text-box :v_name="`${voltInfo.name} ${voltInfo.ca_name} (${voltInfo.sa_name} 본당)`"
                           v-if="voltInfo && Object.keys(voltInfo).length"/>-->
        </span>
      </component>
    </v-layout>
    <float-button path="volunteers"/>
  </v-container>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'
import VolunteerLeader from '@/components/VolunteerLeader'
import VolunteerHistory from '@/components/VolunteerHistory'
import FloatButton from '@/components/control/FloatButton'
import InlineTextBox from '@/components/control/InlineTextBox'
// import { SET_CHANGED_CODE } from '@/store/mutations.type'

/* eslint-disable */
export default {
  name: 'EditVolunteer',
  components: {
    VolunteerItem,
    VolunteerEdus,
    VolunteerActs,
    VolunteerLeader,
    VolunteerHistory,
    FloatButton,
    InlineTextBox
  },
  computed: {
    targetComponents () {
      return ['VolunteerItem', 'VolunteerEdus', 'VolunteerActs', 'VolunteerLeader', 'VolunteerHistory']
    },
    VOLT: {
      get () { return this.voltCore },
      set (item) { Object.assign(this.voltCore, item) }
    },
    VID: {
      get () { return this.v_id },
      set (id) { this.v_id = id }
    }
  },
  watch: {
    tabIdx: {
      immediate: true,
      handler (idx) {
        let path = ''
        if (location.pathname.indexOf('/m-') > 0) {
          path = location.pathname.slice(0, -1) + idx
        } else {
          path = `${location.pathname}/m-${idx}`
        }
        window.history.replaceState({}, null, path)
      }
    },
    v_id (id) {
      this.$store.dispatch('fetchVolunteerItem', id).then(() => {
        this.voltInfo = this.$store.getters.volunteerInfo(parseInt(id))
        // this.$store.commit(SET_CHANGED_CODE, this.voltInfo.area_code)
      })
    }
  },
  props: { id: undefined },
  data: () => ({
    tabIdx: 0,
    v_id: undefined,
    voltInfo: {},
    voltCore: { ca_id: null, name: '', ca_name: '', area_code: null },
    title: ['봉사자 정보', '교육 현황', '봉사 현황', '대표 이력', '전출입 이력']
  }),
  created () {
    if (this.id > 0) this.v_id = this.id
  },
  methods: {
    isAccessible () {
      return true
      /* const auth = this.$store.getters.authInfo
      if (!auth || !auth.area_code) return false
      else if (auth.level === 'L4') return true
      // console.log(this.VOLT.area_code.substr(0, 2), auth.area_code.substr(0, 2))
      return this.VOLT.area_code.substr(0, 2) === auth.area_code.substr(0, 2) */
    }
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      const {id, menu} = to.params
      if (menu) {
        const [m, idx] = menu.split('-')
        idx && (vm.tabIdx = parseInt(idx))
      }
      if (id) {
        await vm.$store.dispatch('fetchVolunteerItem', id)
        vm.voltInfo = vm.$store.getters.volunteerInfo(parseInt(id))
        console.log(vm.voltInfo)
      }
    })
  }
}
</script>

<style>
</style>
