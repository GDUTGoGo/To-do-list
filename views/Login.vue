<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">登录</h2>
        <p class="login-desc">欢迎使用待办事项清单，请输入您的账号信息</p>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin" size="large" round>登录</el-button>
          <el-button type="success" class="login-button" @click="showRegister = true" size="large" round style="margin-top:10px;">注册</el-button>
        </el-form-item>
        <div class="login-tip">初次使用？请直接输入任意用户名和密码体验</div>
      </el-form>
    </el-card>

    <el-dialog v-model="showRegister" title="注册新用户" width="400px">
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-position="top">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" prefix-icon="User" clearable size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（8-16位英文数字）" prefix-icon="Lock" show-password clearable size="large" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock" show-password clearable size="large" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRegister = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const loginForm = reactive({ username: '', password: '' })
const registerForm = reactive({ username: '', password: '', confirmPassword: '' })
const showRegister = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, message: '密码需为8-16位英文和数字组合', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate(async valid => {
    if (valid) {
      try {
        const res = await axios.post('/login', loginForm)
        if (res.data.token) {
          localStorage.setItem('token', res.data.token)
          ElMessage.success('登录成功')
          router.push('/')
        }
      } catch (err) {
        ElMessage.error(err.response?.data || '登录失败')
      }
    }
  })
}

const handleRegister = () => {
  registerFormRef.value.validate(async valid => {
    if (valid) {
      try {
        await axios.post('/register', {
          username: registerForm.username,
          password: registerForm.password
        })
        ElMessage.success('注册成功，请登录')
        showRegister.value = false
        // 注册成功后自动填充用户名到登录表单
        loginForm.username = registerForm.username
        loginForm.password = ''
      } catch (err) {
        ElMessage.error(err.response?.data || '注册失败')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}
.login-card {
  width: 400px;
  padding: 30px 20px 10px 20px;
}
.login-title {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}
.login-desc {
  margin: 0 0 10px 0;
  color: #888;
  font-size: 14px;
}
.login-button {
  width: 100%;
  margin-bottom: 10px;
}
.login-tip {
  color: #aaa;
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
}
</style>