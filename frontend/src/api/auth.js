import request from './request'

export function login(data) {
  return request.post('/auth/login', data)
}

export function logout() {
  return request.post('/auth/logout')
}

export function getCurrentUser() {
  return request.get('/auth/current')
}

export function changePassword(data) {
  return request.put('/auth/password', data)
}
