import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据看板', icon: 'DataAnalysis' }
      },
      {
        path: 'students',
        name: 'Students',
        component: () => import('@/views/Student/StudentList.vue'),
        meta: { title: '学生管理', icon: 'User' }
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('@/views/Teacher/TeacherList.vue'),
        meta: { title: '教师管理', icon: 'UserFilled' }
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/views/Course/CourseList.vue'),
        meta: { title: '课程管理', icon: 'Document' }
      },
      {
        path: 'grades',
        name: 'Grades',
        component: () => import('@/views/Grade/GradeList.vue'),
        meta: { title: '成绩管理', icon: 'Histogram' }
      },
      {
        path: 'schedules',
        name: 'Schedules',
        component: () => import('@/views/Course/ScheduleList.vue'),
        meta: { title: '排课管理', icon: 'Calendar' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/User/Profile.vue'),
        meta: { title: '个人中心', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 学校管理系统` : '学校管理系统'
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
