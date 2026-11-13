import request from './request'

export function getStudentList(params) {
  return request.get('/students/list', { params })
}

export function getStudentDetail(id) {
  return request.get(`/students/${id}`)
}

export function addStudent(data) {
  return request.post('/students', data)
}

export function updateStudent(id, data) {
  return request.put(`/students/${id}`, data)
}

export function deleteStudent(id) {
  return request.delete(`/students/${id}`)
}

export function batchImportStudents(data) {
  return request.post('/students/batch', data)
}
