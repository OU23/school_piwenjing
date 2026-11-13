<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <span>排课管理</span>
      </template>

      <el-form :inline="true" class="filter-form">
        <el-form-item label="学期">
          <el-select v-model="semester">
            <el-option label="2023-2024-1" value="2023-2024-1" />
            <el-option label="2023-2024-2" value="2023-2024-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-input-number v-model="classId" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadSchedules">查询</el-button>
          <el-button type="success" @click="handleAdd">+ 添加排课</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="teacher_name" label="授课教师" width="100" />
        <el-table-column prop="class_name" label="班级" width="120" />
        <el-table-column prop="day_of_week" label="星期" width="80">
          <template #default="{ row }">{{ ['一', '二', '三', '四', '五', '六', '日'][row.day_of_week - 1] }}</template>
        </el-table-column>
        <el-table-column prop="start_period" label="节次" width="100">
          <template #default="{ row }">{{ row.start_period }}-{{ row.end_period }}节</template>
        </el-table-column>
        <el-table-column prop="room_id" label="教室" width="100" />
        <el-table-column prop="week_range" label="周次" width="100" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="添加排课" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="课程">
          <el-select v-model="form.courseId" filterable>
            <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="教师">
          <el-select v-model="form.teacherId" filterable>
            <el-option v-for="t in teachers" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-input-number v-model="form.classId" :min="1" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="星期">
              <el-select v-model="form.dayOfWeek">
                <el-option v-for="i in 7" :key="i" :label="['一','二','三','四','五','六','日'][i-1]" :value="i" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室">
              <el-input v-model="form.roomId" placeholder="如: A101" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="节次">
          <el-input-number v-model="form.startPeriod" :min="1" :max="12" /> 至
          <el-input-number v-model="form.endPeriod" :min="1" :max="12" />
        </el-form-item>
        <el-form-item label="周次范围">
          <el-input v-model="form.weekRange" placeholder="如: 1-16" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getScheduleList, addSchedule, deleteSchedule, getCourseList } from '@/api/course'
import { getTeacherList } from '@/api/teacher'

const loading = ref(false)
const tableData = ref([])
const courses = ref([])
const teachers = ref([])
const semester = ref('2023-2024-1')
const classId = ref(1)
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({ courseId: null, teacherId: null, classId: 1, dayOfWeek: 1, startPeriod: 1, endPeriod: 2, roomId: '', weekRange: '1-16' })

async function loadSchedules() {
  loading.value = true
  try {
    const res = await getScheduleList({ classId: classId.value, semester: semester.value })
    tableData.value = res.data || []
  } finally { loading.value = false }
}

async function loadCourses() {
  const res = await getCourseList({ pageNum: 1, pageSize: 100 })
  courses.value = res.data.list
}

async function loadTeachers() {
  const res = await getTeacherList({ pageNum: 1, pageSize: 100 })
  teachers.value = res.data.list
}

function handleAdd() {
  Object.assign(form, { courseId: null, teacherId: null, classId: classId.value, dayOfWeek: 1, startPeriod: 1, endPeriod: 2, roomId: '', weekRange: '1-16' })
  dialogVisible.value = true
}

async function handleSubmit() {
  form.semester = semester.value
  await addSchedule(form)
  ElMessage.success('添加成功')
  dialogVisible.value = false
  loadSchedules()
}

async function handleDelete(id) {
  await deleteSchedule(id)
  ElMessage.success('删除成功')
  loadSchedules()
}

onMounted(() => { loadSchedules(); loadCourses(); loadTeachers() })
</script>

<style scoped>
.filter-form { margin-bottom: 16px; }
</style>
