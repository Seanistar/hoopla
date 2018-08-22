<template>
  <div class="view-scrap">
    <scrap-list/>
  </div>
</template>

<script>
import ScrapList from '@/components/ScrapList'

export default {
  name: 'ViewScrap',
  components: { ScrapList }
}
</script>

<style scoped>
  .view-scrap {
    padding-top: 10px
  }
</style>
