<template>
  <div class="view-volunteer">
    <volunteer-list/>
    <button @click="codeTest">test</button>
  </div>
</template>

<script>
import VolunteerList from '@/components/VolunteerList'
import { VolunteerService } from '@/common/api.service'

export default {
  name: 'ViewVolts',
  components: { VolunteerList },
  methods: {
    async codeTest () {
      const res = await VolunteerService.test('01-01002-01002003')
      console.log(res.data)
    }
  }
}
</script>

<style scoped>
  .view-volunteer {
    padding-top: 10px
  }
</style>
