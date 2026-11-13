import request from './request'

export function getTeacherList(params) {
  return request.get('/teachers/list', { params })
}

export function getTeacherDetail(id) {
  return request.get(`/teachers/${id}`)
}

export function addTeacher(data) {
  return request.post('/teachers', data)
}

export function updateTeacher(id, data) {
  return request.put(`/teachers/${id}`, data)
}

export function deleteTeacher(id) {
  return request.delete(`/teachers/${id}`)
}
