<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx"
             @click="tabIdx = idx" :disabled="v_id === undefined && idx !== 0">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <component :is="targetComponents[tabIdx]" :v_id.sync="v_id"/>
    </v-layout>
    <float-button/>
  </v-container>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'
import VolunteerLeader from '@/components/VolunteerLeader'
import VolunteerHistory from '@/components/VolunteerHistory'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'EditVolunteer',
  components: {
    VolunteerItem,
    VolunteerEdus,
    VolunteerActs,
    VolunteerLeader,
    VolunteerHistory,
    FloatButton
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
      set (id) { if (this.v_id === undefined) this.v_id = id }
    }
  },
  props: { id: undefined },
  data: () => ({
    tabIdx: 0,
    v_id: undefined,
    voltCore: { ca_id: null, name: '', ca_name: '', area_code: null },
    title: ['봉사자 정보', '교육 현황', '봉사 현황', '대표 이력', '전출입 이력']
  }),
  created () {
    if (this.id > 0) this.v_id = this.id
  },
  methods: {
    isAccessible () {
      const auth = this.$store.getters.authInfo
      if (!auth || !auth.area_code) return false
      else if (auth.level === 'L4') return true
      // console.log(this.VOLT.area_code.substr(0, 2), auth.area_code.substr(0, 2))
      return this.VOLT.area_code.substr(0, 2) === auth.area_code.substr(0, 2)
    }
  }
}
</script>

<style>
</style>
