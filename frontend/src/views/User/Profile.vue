<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header><span>个人中心</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ userStore.userInfo?.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userStore.userInfo?.realName }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="userStore.roleType === 'admin' ? 'danger' : userStore.roleType === 'teacher' ? 'warning' : 'info'">
            {{ userStore.roleType === 'admin' ? '管理员' : userStore.roleType === 'teacher' ? '教师' : '学生' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="登录时间">{{ new Date().toLocaleString() }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
</script>
