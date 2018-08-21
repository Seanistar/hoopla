<template>
  <div class="home-author">
    <author-list/>
  </div>
</template>

<script>
import AuthorList from '@/components/AuthorList'
export default {
  name: 'HomeScrap',
  components: { AuthorList }
}
</script>

<style scoped>
  .home-author {
    padding-top: 10px
  }
</style>
