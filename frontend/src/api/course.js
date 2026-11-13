import request from './request'

export function getCourseList(params) {
  return request.get('/courses/list', { params })
}

export function getCourseDetail(id) {
  return request.get(`/courses/${id}`)
}

export function addCourse(data) {
  return request.post('/courses', data)
}

export function updateCourse(id, data) {
  return request.put(`/courses/${id}`, data)
}

export function deleteCourse(id) {
  return request.delete(`/courses/${id}`)
}

export function assignTeacher(courseId, teacherId, isPrimary) {
  return request.post(`/courses/${courseId}/teachers/${teacherId}?isPrimary=${isPrimary}`)
}

export function getScheduleList(params) {
  return request.get('/schedules/class/' + params.classId, { params: { semester: params.semester } })
}

export function getTeacherSchedule(teacherId, semester) {
  return request.get(`/schedules/teacher/${teacherId}?semester=${semester}`)
}

export function addSchedule(data) {
  return request.post('/schedules', data)
}

export function deleteSchedule(id) {
  return request.delete(`/schedules/${id}`)
}

export function getStatistics() {
  return request.get('/statistics/dashboard')
}

export function getGradesByStudent(studentId, semester) {
  return request.get(`/grades/student/${studentId}?semester=${semester}`)
}

export function getGradesByCourse(courseId, semester) {
  return request.get(`/grades/course/${courseId}?semester=${semester}`)
}

export function getGradeStatistics(courseId, semester) {
  return request.get(`/grades/statistics/${courseId}?semester=${semester}`)
}

export function addGrade(data) {
  return request.post('/grades', data)
}

export function batchAddGrades(data) {
  return request.post('/grades/batch', data)
}
