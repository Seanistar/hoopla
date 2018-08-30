<template>
  <div class="tp-10">
    <v-container>
      <v-tabs left>
        <v-tab v-for="(item, idx) in title" :key="idx" @click="changeTab(idx)"><strong>{{ item }}</strong></v-tab>
      </v-tabs>
      <v-divider class="bm-10 tm-10"></v-divider>
      <volunteer-item v-if="tabIdx === 0" :v_id="v_id"/>
      <volunteer-edus v-else-if="tabIdx === 1" :v_id="v_id"/>
      <volunteer-acts v-else-if="tabIdx === 2" :v_id="v_id"/>
    </v-container>
    <v-alert class="alert-c" v-model="alert.show" color="warning" icon="priority_high"
             dismissible transition="scale-transition">
      {{ alert.message }}
    </v-alert>
  </div>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'

export default {
  name: 'NewVolts',
  components: { VolunteerItem, VolunteerEdus, VolunteerActs },
  computed: {
    lastVolunteerID () {
      return this.$store.getters.lastVolunteerID
    }
  },
  data: () => ({
    tabIdx: 0,
    isAdded: false,
    v_id: undefined,
    alert: {show: false, message: '기본 정보 설정이 필요합니다!'},
    title: ['봉사자 기본 정보', '봉사자 교육 현황', '봉사자 활동 내역']
  }),
  methods: {
    changeTab (idx) {
      if (idx !== 0 && !this.isAdded) {
        this.alert.show = true
        setTimeout(() => {
          this.alert.show = false
        }, 2000)
      }
      this.tabIdx = idx
    },
    addDone () {
      this.isAdded = true
      console.log(this.v_id = this.lastVolunteerID)
    }
  }
}
</script>

<style>
</style>
