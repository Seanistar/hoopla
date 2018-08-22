<template>
  <div class="view-volunteer">
    <volts-list/>
  </div>
</template>

<script>
import VoltsList from '@/components/VolunteerList'

export default {
  name: 'ViewVolts',
  components: { VoltsList }
}
</script>

<style scoped>
  .view-volunteer {
    padding-top: 10px
  }
</style>
