<template>
  <div class="view-author">
    <author-list/>
  </div>
</template>

<script>
import AuthorList from '@/components/AuthorList'
export default {
  name: 'ViewAuthor',
  components: { AuthorList }
}
</script>

<style scoped>
  .view-author {
    padding-top: 10px
  }
</style>
