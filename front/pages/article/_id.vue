<template>
  <div class="kkb-container">
    <UserDisplay :user="article.author">
      <el-button type="success" v-if="isFollow" @click="unfollow">已关注</el-button>
      <el-button v-else @click="follow">关注</el-button>
    </UserDisplay>
    <el-divider></el-divider>
    <div class="article" v-html="article.article_html"></div>
    <el-divider></el-divider>
    <div class="action">
      <el-button @click="likeAction" :type="likeStatus?'success':'info'">
        <i class="el-icon-thumb">{{ article.like }}</i>
      </el-button>
    </div>
  </div>
</template>

<script>
import UserDisplay from '~/components/UserDisplay.vue'

export default {
  components: { UserDisplay },
  data() {
    return {
      isFollow: false,
      article: {
        title: '',
        views: 0,
        author: {}
      },
      likeStatus: false,
      disLikeStatus: false
    }
  },
  mounted() {
    let { id } = this.$route.params
    this.id = id
    this.getArticle()
    let token = localStorage.getItem('token')
    if(token) {
      this.getLikeStatus()
    }
  },
  methods: {
    async follow() {
      let ret = await this.$http.put('/user/follow/' + this.article.author._id)
      this.$message({
        type: 'success',
        message: ret.msg
      })
      await this.checkFollowStatus()
    },

    async unfollow() {
      let ret = await this.$http.delete(
        '/user/follow/' + this.article.author._id
      )
      this.$message({
        type: 'success',
        message: ret.msg
      })
      await this.checkFollowStatus()
    },

    async getArticle() {
      let ret = await this.$http.get('/article/' + this.id)
      this.article = ret.data.info
      console.log(this.article)
      // 查询我和文章作者的关注关系
      await this.checkFollowStatus()
    },
    async checkFollowStatus() {
      let isFollow = await this.$http.get(
        '/user/follow/' + this.article.author._id
      )
      if (isFollow.code === 0) {
        this.isFollow = isFollow.data.isFollow
      }
    },

    async likeAction() {
      let type = this.likeStatus ? 'delete' : 'put'
      let offset = this.likeStatus ? -1 : 1
      let ret = await this.$http[type]('/user/likeArticle/' + this.id)
      if (ret.code === 0) {
        this.getLikeStatus()
        // this.getArticle()
        this.article.like += offset
        this.$notify({
          title: ret.msg,
          type: 'success'
        })
      }
    },
    async getLikeStatus() {
      // 获取用户对当前文章的点赞 和 踩的状态
      let ret = await this.$http.get('user/article/' + this.id)
      console.log(ret)
      if (ret.code === 0) {
        this.likeStatus = ret.data.like
        this.disLikeStatus = ret.data.dislike
      }
    },
  }
}
</script>

<style>

</style>
