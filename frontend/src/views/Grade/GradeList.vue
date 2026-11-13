<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <span>成绩管理</span>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="学期">
          <el-select v-model="semester" @change="loadGrades">
            <el-option label="2023-2024-1" value="2023-2024-1" />
            <el-option label="2023-2024-2" value="2023-2024-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="courseId" @change="loadGrades" clearable>
            <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生">
          <el-input v-model="studentKeyword" placeholder="输入姓名/学号" clearable @input="loadGrades" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadGrades">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="student_no" label="学号" width="120" />
        <el-table-column prop="student_name" label="姓名" width="100" />
        <el-table-column prop="course_code" label="课程编码" width="120" />
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="score" label="分数" width="80">
          <template #default="{ row }">
            <span :style="{ color: row.score >= 90 ? '#67C23A' : row.score >= 60 ? '#E6A23C' : '#F56C6C' }">
              {{ row.score ?? '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="grade_point" label="绩点" width="80" />
        <el-table-column prop="exam_type" label="考试类型" width="100" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pageNum" :total="total" layout="prev, pager, next"
        @change="loadGrades" style="margin-top: 16px" />
    </el-card>

    <el-dialog v-model="dialogVisible" title="编辑成绩" width="400px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="分数">
          <el-input-number v-model="form.score" :min="0" :max="100" :precision="1" />
        </el-form-item>
        <el-form-item label="绩点">
          <el-input-number v-model="form.gradePoint" :min="0" :max="4" :precision="1" />
        </el-form-item>
        <el-form-item label="考试类型">
          <el-select v-model="form.examType">
            <el-option label="期末" value="期末" />
            <el-option label="期中" value="期中" />
            <el-option label="平时" value="平时" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGradesByCourse, getGradeStatistics, getCourseList, addGrade } from '@/api/course'

const loading = ref(false)
const tableData = ref([])
const courses = ref([])
const semester = ref('2023-2024-1')
const courseId = ref(null)
const studentKeyword = ref('')
const pageNum = ref(1)
const total = ref(0)
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ score: null, gradePoint: null, examType: '期末', studentId: null, courseId: null })

async function loadCourses() {
  const res = await getCourseList({ pageNum: 1, pageSize: 100 })
  courses.value = res.data.list
}

async function loadGrades() {
  loading.value = true
  try {
    const res = await getGradesByCourse(courseId.value || 0, semester.value)
    tableData.value = res.data || []
    total.value = tableData.value.length
  } finally { loading.value = false }
}

function handleEdit(row) {
  form.studentId = row.student_id
  form.courseId = row.course_id
  form.score = row.score
  form.gradePoint = row.grade_point
  form.examType = row.exam_type || '期末'
  dialogVisible.value = true
}

async function handleSubmit() {
  await addGrade({ ...form, semester: semester.value })
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadGrades()
}

onMounted(() => { loadCourses(); loadGrades() })
</script>

<style scoped>
.filter-form { margin-bottom: 16px; }
</style>
