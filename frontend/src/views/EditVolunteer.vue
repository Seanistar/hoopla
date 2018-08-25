<template>
  <div class="tp-10">
    <v-container>
      <v-tabs left>
        <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
          <strong>{{ item.text }}</strong>
        </v-tab>
      </v-tabs>
      <v-divider class="bm-10 tm-10"></v-divider>
      <volunteer-item v-if="tabIdx === 0" :volt="volt"/>
      <volunteer-edus v-else-if="tabIdx === 1"/>
      <volunteer-acts v-else/>
    </v-container>
  </div>
</template>

<script>
import { isEmpty } from 'lodash/lang'
import { FETCH_VOLUNTEER } from '@/store/actions.type'
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'

export default {
  name: 'EditVolts',
  components: { VolunteerItem, VolunteerEdus, VolunteerActs },
  props: {
    volt: { type: Object, default: () => {} }
  },
  data: () => ({
    tabIdx: 0,
    title: [
      { text: '봉사자 기본 정보', link: '' },
      { text: '봉사자 교육 현황', link: '' },
      { text: '봉사자 활동 내역', link: '' }
    ]
  }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getVoltInfo(to.params.id)
    })
  },
  methods: {
    getVoltInfo (id) {
      if (isEmpty(this.volt)) return this.$store.dispatch(FETCH_VOLUNTEER, id)
      const res = this.$store.getters.volunteerInfo(id)
      console.log(this.volt = res)
    }
  }
}
</script>

<style>
</style>
