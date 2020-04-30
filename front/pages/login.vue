<template>
  <div class="login-container">
    <el-form class="login-form" ref="form" :model="form" :rules="rules">
      <!--      <div class="title-container">-->
      <!--        <img src="/logo.png" alt="">-->
      <!--      </div>-->
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-edit"></i>
        </span>
        <el-input
          ref="email"
          v-model="form.email"
          placeholder="邮箱"
          name="email"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          ref="password"
          v-model="form.password"
          placeholder="密码"
          name="password"
          type="password"
        >
        </el-input>
      </el-form-item>
      <!--   .native 在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native
        .prevent  阻止默认事件  -->
      <el-button type="primary" @click.native.prevent="handleLogin">
        登陆
      </el-button>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  name: 'Login',
  layout: 'loginDefault',
  data() {
    return {
      form: {
        email: '1518343069@qq.com',
        password: 'admin'
      },
      rules: {
        email: [
          {
            required: true,
            message: '请输入邮箱'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式'
          }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      let ret = await this.$store.dispatch('user/login', {
        email: this.form.email,
        password: md5(this.form.password)
      })
      if (ret.code === 0) {
        this.$notify({
          title: '登录成功',
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push({ path: '/' })
        }, 1000)
      }
      // return
      // let ret = await this.$http.post('/user/login',{
      //   email:this.form.email,
      //   password:md5(this.form.password)
      // })
      // if(ret.code==0){
      //   localStorage.setItem('token',ret.data.token)

      // }
      // console.log('登录',ret)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
