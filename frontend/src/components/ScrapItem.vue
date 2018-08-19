<template>
  <div class="article-preview">
    <!--<topic-meta
      :article="article"
      :isPreview="true">
    </topic-meta>-->
    <router-link
      :to="{name: 'topic', params: {'slug': topic.id}}"
      class="preview-link">
      <h1>{{topic.title}}</h1>
      <p>{{topic.content}}</p>
      <span>Read more...</span>
      <!--<ul class="tag-list">
        <li class="tag-default tag-pill tag-outline"
            v-for="(tag, index) of article.tagList"
            :key="tag + index">
          {{ tag }}
        </li>
      </ul>-->
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'TopicPreview',
  props: {
    topic: { type: Object, required: true }
  }
}
</script>

<style scoped>
</style>
