<template>
  <v-container pt-0>
    <v-tabs left align-with-title fixed-tabs class="elevation-4">
      <v-tab v-for="(item, idx) in title" :key="idx" :disabled="isRestricted(idx)"
             @click="tabIdx = idx">
        <strong>{{ item }}</strong>
      </v-tab>
    </v-tabs>
    <v-layout pt-1>
      <component :is="targetComponents[tabIdx]"/>
    </v-layout>
  </v-container>
</template>

<script>
import ManageArea from '@/components/ManageArea'
import ManageEdus from '@/components/ManageEdus'
import ManageAdmin from '@/components/ManageAdmin'

export default {
  name: 'ViewOthers',
  components: { ManageArea, ManageEdus, ManageAdmin },
  computed: {
    targetComponents () {
      return ['ManageArea', 'ManageEdus', 'ManageAdmin']
    },
    adminLevel () {
      const info = this.$store.getters.authInfo
      return info.level
    }
  },
  data: () => ({
    tabIdx: 0,
    title: ['구역 설정', '교육 및 봉사', '관리자 설정']
  }),
  methods: {
    isRestricted (idx) {
      return this.adminLevel === 'L3' && idx === 2
    }
  }
}
</script>

<style scoped>
</style>
