<template>
  <div class="pt-0">
    <query-list ref="que"/>
  </div>
</template>

<script>
import QueryList from '@/components/QueryList'

export default {
  name: 'QueryVolunteer',
  components: { QueryList },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$refs.que.setLastInfo()
    })
  }
}
</script>

<style scoped>
</style>
