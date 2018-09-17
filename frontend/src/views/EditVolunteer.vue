<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx"
             @click="tabIdx = idx" :disabled="v_id === undefined && idx !== 0">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <!--<volunteer-item v-if="tabIdx === 0" :v_id="v_id" @add-volunteer="addDone"/>
      <volunteer-edus v-else-if="tabIdx === 1" :v_id="v_id"/>
      <volunteer-acts v-else-if="tabIdx === 2" :v_id="v_id"/>
      <volunteer-leader v-else-if="tabIdx === 3" :v_id="v_id"/>
      <volunteer-history v-else-if="tabIdx === 4" :v_id="v_id"/>-->
      <component :is="targetComponents[tabIdx]" :v_id="v_id"/>
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
    newVolunteerID () {
      return this.$store.getters.newVolunteerID
    },
    targetComponents () {
      return ['VolunteerItem', 'VolunteerEdus', 'VolunteerActs', 'VolunteerLeader', 'VolunteerHistory']
    }
  },
  props: { id: undefined },
  data: () => ({
    tabIdx: 0,
    v_id: undefined,
    voltCore: { ca_id: null, name: '', ca_name: '' },
    title: ['봉사자 정보', '교육 현황', '봉사 현황', '대표 이력', '전출입 이력']
  }),
  created () {
    this.v_id = this.id
  },
  methods: {
    addDone () {
      console.log(this.v_id = this.newVolunteerID)
    },
    setCore (item) { Object.assign(this.voltCore, item) },
    getCore () { return this.voltCore }
  }
}
</script>

<style>
</style>
