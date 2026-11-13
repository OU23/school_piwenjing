<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #409EFF"><el-icon size="32"><User /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalStudents || 0 }}</div>
            <div class="stat-label">学生总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #67C23A"><el-icon size="32"><UserFilled /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalTeachers || 0 }}</div>
            <div class="stat-label">教师总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #E6A23C"><el-icon size="32"><Document /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalCourses || 0 }}</div>
            <div class="stat-label">课程总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" style="background: #F56C6C"><el-icon size="32"><School /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalClasses || 0 }}</div>
            <div class="stat-label">班级总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>学生分布（按班级）</span></template>
          <div id="studentChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>课程类型分布</span></template>
          <div id="courseChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getStatistics } from '@/api/course'

const stats = ref({})

onMounted(async () => {
  const res = await getStatistics()
  stats.value = res.data

  // 学生分布图
  const studentChart = echarts.init(document.getElementById('studentChart'))
  studentChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: (res.data.studentByClass || []).map(item => ({ name: item.className, value: item.count }))
    }]
  })

  // 课程类型图
  const courseChart = echarts.init(document.getElementById('courseChart'))
  courseChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (res.data.courseByType || []).map(i => i.courseType) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: (res.data.courseByType || []).map(i => i.count),
      itemStyle: { color: '#409EFF' }
    }]
  })

  window.addEventListener('resize', () => {
    studentChart.resize()
    courseChart.resize()
  })
})
</script>

<style scoped>
.dashboard { padding: 0; }
.stat-card { display: flex; align-items: center; padding: 20px; }
.stat-icon {
  width: 64px; height: 64px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; margin-right: 16px;
}
.stat-info { flex: 1; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }
</style>
