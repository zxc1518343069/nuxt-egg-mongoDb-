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
      <el-form-item prop="captcha" class="email-code">
        <div class="send-email-btn">
          <img @click="resetCaptcha" :src="code.captcha" alt="">
        </div>
        <span class="svg-container">
          <i class="el-icon-camera"></i>
        </span>
        <el-input
          ref="captcha"
          v-model="form.captcha"
          placeholder="验证码"
          name="captcha"
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
      <el-form-item prop="repassword">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          type="password"
          ref="repassword"
          v-model="form.repassword"
          placeholder="请在此输入密码"
          name="repassword"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="nickname"
          v-model="form.nickname"
          placeholder="请在此输入账户名"
          name="nickname"
        >
        </el-input>
      </el-form-item>
<!--   .native 在某个组件的根元素上监听一个原生事件。可以使用 v-on 的修饰符 .native
  .prevent  阻止默认事件  -->
      <el-button type="primary" @click.native.prevent="handleRegister">
        注册
      </el-button>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  name: 'Register',
  layout: 'loginDefault', // 继承是根据layouts 下面的文件名称
  data() {
    return {
      form: {
        email: '1518343069@qq.com',
        captcha: '1234',
        password: 'admin',
        repassword: 'admin',
        nickname: '吴轶琛'
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
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码'
          }
        ]
      },
      code: {
        captcha: '/api/user/captcha'
      }
    }
  },
  methods: {
    resetCaptcha() {
      this.code.captcha = '/api/user/captcha?_t=' + new Date().getTime()
    },
    handleRegister() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('校验成功')
          let obj = {
            email: this.form.email,
            captcha: this.form.captcha,
            password: md5(this.form.password),
            nickname: this.form.nickname
          }
          let ret = await this.$http.post('/user/register', obj)
          console.log(ret)
          if (ret.code === 0) {
            this.$message({
              type: 'success',
              message: '注册成功 正在跳转'
            })
            setTimeout(() => {
              this.$router.push({ path: '/user/' + ret.data.userId })
            }, 1000)
          } else {
            this.$message({
              type: 'warning',
              message: ret.msg
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
.email-code {
  width: 340px;
  position: relative;

  .send-email-btn {
    position: absolute;
    right: -110px;

    .el-button {
      width: 90px;
      height: 50px;
    }

    img {
      width: 90px;
      height: 50px;
      cursor: pointer;
    }
  }
}
</style>
