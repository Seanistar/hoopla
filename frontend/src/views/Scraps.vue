<template>
  <div class="home-scrap">
    <scrap-list/>
  </div>
</template>

<script>
import ScrapList from '@/components/ScrapList'
export default {
  name: 'HomeScrap',
  components: { ScrapList }
}
</script>

<style scoped>
  .home-scrap {
    padding-top: 10px
  }
</style>
