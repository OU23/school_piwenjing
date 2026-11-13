<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>课程列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon> 添加课程
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryForm" class="filter-form">
        <el-form-item label="课程名称/编码">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" clearable @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="queryForm.courseType" placeholder="全部" clearable>
            <el-option label="必修" value="必修" />
            <el-option label="选修" value="选修" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column prop="courseCode" label="课程编码" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="courseType" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.courseType === '必修' ? 'primary' : 'success'" size="small">
              {{ row.courseType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="credits" label="学分" width="80" />
        <el-table-column prop="hours" label="学时" width="80" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="queryForm.pageNum" v-model:page-size="queryForm.pageSize"
        :total="total" layout="total, prev, pager, next" @change="loadData" style="margin-top: 16px" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑课程' : '添加课程'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程编码" prop="courseCode">
          <el-input v-model="form.courseCode" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" />
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="form.courseType">
            <el-option label="必修" value="必修" />
            <el-option label="选修" value="选修" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学分">
              <el-input-number v-model="form.credits" :precision="1" :step="0.5" :min="0.5" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学时">
              <el-input-number v-model="form.hours" :min="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="部门ID">
          <el-input-number v-model="form.deptId" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCourseList, addCourse, updateCourse, deleteCourse } from '@/api/course'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const queryForm = reactive({ keyword: '', courseType: '', pageNum: 1, pageSize: 20 })
const form = reactive({ courseCode: '', courseName: '', courseType: '必修', credits: 3, hours: 48, deptId: 1 })
const rules = { courseCode: [{ required: true }], courseName: [{ required: true }] }

function resetQuery() {
  Object.assign(queryForm, { keyword: '', courseType: '', pageNum: 1 })
  loadData()
}

async function loadData() {
  loading.value = true
  try {
    const res = await getCourseList(queryForm)
    tableData.value = res.data.list
    total.value = Number(res.data.total)
  } finally { loading.value = false }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(form, { courseCode: '', courseName: '', courseType: '必修', credits: 3, hours: 48, deptId: 1 })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateCourse(form.id, form)
    } else {
      await addCourse(form)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } finally { submitLoading.value = false }
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除课程 ${row.courseName} 吗？`)
  await deleteCourse(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.filter-form { margin-bottom: 16px; }
</style>
