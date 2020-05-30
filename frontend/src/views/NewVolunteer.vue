<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx" @click="changeTab(idx)"><strong>{{ item }}</strong></v-tab>
    </v-tabs>
    <v-layout pt-1>
      <volunteer-item v-if="tabIdx === 0" :v_id="v_id"/>
      <volunteer-edus v-else-if="tabIdx === 1" :v_id="v_id"/>
      <volunteer-acts v-else-if="tabIdx === 2" :v_id="v_id"/>
    </v-layout>
    <float-button path="volunteers"/>
  </v-container>
</template>

<script>
import VolunteerItem from '@/components/volunteer/Item'
import VolunteerEdus from '@/components/volunteer/Edus'
import VolunteerActs from '@/components/volunteer/Acts'
import FloatButton from '@/components/control/FloatButton'

export default {
  name: 'NewVolunteer',
  components: { FloatButton, VolunteerItem, VolunteerEdus, VolunteerActs },
  computed: {
    newVolunteerID () {
      return this.$store.getters.newVolunteerID
    }
  },
  data: () => ({
    tabIdx: 0,
    isAdded: false,
    v_id: undefined,
    title: ['기본 정보', '교육 현황', '그룹공부 봉사', '대표 이력', '전출입 이력']
  }),
  methods: {
    changeTab (idx) {
      if (idx !== 0 && !this.isAdded) {
        this.tabIdx = null
        return alert('기본 정보 설정이 필요합니다.')
      }
      this.tabIdx = idx
    },
    addDone () {
      this.isAdded = true
      console.log(this.v_id = this.newVolunteerID)
    }
  }
}
</script>

<style>
</style>
