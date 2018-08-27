<template>
  <div class="tp-10">
    <v-container>
      <v-tabs left>
        <v-tab v-for="(item, idx) in title" :key="idx" @click="tabIdx = idx">
          <strong>{{ item.text }}</strong>
        </v-tab>
      </v-tabs>
      <v-divider class="bm-10 tm-10"></v-divider>
      <volunteer-item v-if="tabIdx === 0" :v_id="id" ref="Item"/>
      <volunteer-edus v-else-if="tabIdx === 1" :v_id="id" ref="Edus"/>
      <volunteer-acts v-else-if="tabIdx === 2" :v_id="id" ref="Acts"/>
    </v-container>
  </div>
</template>

<script>
import VolunteerItem from '@/components/VolunteerItem'
import VolunteerEdus from '@/components/VolunteerEdus'
import VolunteerActs from '@/components/VolunteerActs'

// const _menu = ['Item', 'Edus', 'Acts']
export default {
  name: 'EditVolts',
  components: { VolunteerItem, VolunteerEdus, VolunteerActs },
  props: { id: null },
  watch: {
    tabIdx (idx) {
      // this.$refs[_menu[idx]].fetchData()
      if (idx === 1 || idx === 2) {

      }
    }
  },
  data: () => ({
    tabIdx: 0,
    title: [
      { text: '봉사자 기본 정보', link: '' },
      { text: '봉사자 교육 현황', link: '' },
      { text: '봉사자 활동 내역', link: '' }
    ]
  })
}
</script>

<style>
</style>
