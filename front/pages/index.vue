<template>
  <div class="container">
    <h1>文章列表</h1>
    <ArticleList
      v-for="article in articleList"
      :key="article._id"
      :article="article"
    >
    </ArticleList>
  </div>
</template>

<script>
import ArticleList from './../components/ArticleList'
import Logo from '~/components/Logo.vue'
export default {
  data() {
    return {
      articleList: []
    }
  },
  components: {
    Logo,ArticleList
  },
  async mounted() {
    const res = await this.$http.get('/article')
    if (res.code === 0) {
      this.articleList = res.data
    }
  }
}
</script>

<style>
</style>
