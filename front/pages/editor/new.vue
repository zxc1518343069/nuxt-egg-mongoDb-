<template>
  <div>
    <div class="write-btn">
      <el-button @click="submit" type="primary">发布</el-button>
    </div>
    <el-input v-model="title" placeholder="请输入标题"></el-input>
    <el-row>
      <el-col :span="12">
        <!-- markdown编辑器 -->
        <textarea class="md-editor" :value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledHtml">
          <!-- html显示 -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import marked from 'marked'

export default {
  name: 'New',
  data() {
    return {
      content: `# 吴轶琛  *爱你`,
      title: '测试标题'
    }
  },
  methods: {
    async submit() {
      let ret = await this.$http.post('/article/creat', {
        content: this.content,
        title: this.title
      })
      if (ret.code === 0) {
        this.$message({
          message: `创建${this.title}成功，正在跳转页面`,
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push(`/article/${ret.data.id}`)
        }, 1000)
      }
    },
    update: debounce(function (e) {
      this.content = e.target.value
    }, 150)
  },
  computed: {
    compiledHtml() {
      return marked(this.content)
    }
  }
}
</script>

<style scoped>
.md-editor {
  width: 100%;
  height: 100vh;
  outline: none;
}

.markdown-body {
  height: 100vh;
  overflow-y: scroll;
}

.write-btn {
  position: fixed;
  z-index: 100;
  right: 10px;
  top: 10px;
}
</style>
