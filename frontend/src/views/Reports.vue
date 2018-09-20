<template>
  <div class="pt-0">
    <report-list ref="rl"/>
  </div>
</template>

<script>
import ReportList from '@/components/ReportList'

export default {
  name: 'ReportHome',
  components: { ReportList },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$refs.rl.setLastChangedCode()
    })
  }
}
</script>

<style scoped>
</style>
