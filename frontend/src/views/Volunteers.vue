<template>
  <div>
    <volunteer-list/>
    <!--<button @click="codeTest">test</button>-->
  </div>
</template>

<script>
import VolunteerList from '@/components/VolunteerList'
import {CodeService} from '@/common/api.service'

export default {
  name: 'ViewVolts',
  components: { VolunteerList },
  methods: {
    async codeTest () {
      const res = await CodeService.test('01-01002-01002003')
      console.log(res.data)
    }
  }
}
</script>

<style scoped>
</style>
