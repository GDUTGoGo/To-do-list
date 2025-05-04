<template>
  <el-container class="app-container">
    <el-header>
      <el-menu
        :router="true"
        mode="horizontal"
        :ellipsis="false"
        class="nav-menu"
      >
        <el-menu-item index="/">
          <el-icon><Calendar /></el-icon>
          <span>待办事项清单✅</span>
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="/login" class="right-menu-item">
          <el-icon><User /></el-icon>
          <span>登录</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { Calendar, User } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.nav-menu {
  display: flex;
  justify-content: space-between;
  border-bottom: none;
  background-color: #ffffff;
  padding: 0 20px;
  height: 60px;
  transition: all 0.3s ease;
}

.flex-grow {
  flex-grow: 1;
}

.right-menu-item {
  margin-left: auto;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 100;
}

.el-menu-item {
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.el-menu-item .el-icon {
  margin-right: 5px;
  font-size: 18px;
}

.el-main {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

@media screen and (max-width: 768px) {
  .nav-menu {
    padding: 0 10px;
  }

  .el-menu-item span {
    font-size: 14px;
  }

  .el-main {
    padding: 10px;
  }
}
</style>