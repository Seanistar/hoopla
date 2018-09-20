<template>
  <div pt-0>
    <volunteer-list ref="vl"/>
    <!--<button @click="codeTest">test</button>-->
  </div>
</template>

<script>
import VolunteerList from '@/components/VolunteerList'
import { CodeService } from '@/common/api.service'

export default {
  name: 'ViewVolts',
  components: { VolunteerList },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$refs.vl.setLastChangedCode()
    })
  },
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
