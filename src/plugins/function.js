import Vue from 'vue'
// 绑定服务器端地址
export function bindURL (url) {
  // Vue.prototype.bindUrl = function (url) {
  return 'http://127.0.0.1:8088/' + url
  // }
}
// 绑定图片上传地址
export function bindImg (url) {
  // Vue.prototype.bindImg = function (url) {
  return 'http://127.0.0.1:8088/' + url
  // }
}
// 转换URL
export function toURL (obj) {
  const arr = []
  for (const key in obj) {
    arr.push(key + '=' + obj[key])
  }
  return arr.join('&')
}
// 建议深拷贝
export function convertDeepCopy (data) {
  return JSON.parse(JSON.stringify(data))
}
// 时间格式化
Vue.filter('formatDate', date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = pad0(date.getMonth() + 1)
  const day = pad0(date.getDate())
  const hour = pad0(date.getHours())
  const minute = pad0(date.getMinutes())
  const second = pad0(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

// 补0
function pad0 (data, len = 2) {
  return ('00000000000' + data).substr(-len)
}

// 防抖
// 指触发事件后在n秒内函数只执行一次，如果在n秒内又触发了事件，
// 则会重新计算函数执行时间。如：搜素框，滚动条
export function debounce (func, wait = 1000) {
  let timeout
  return function () {
    const context = this
    const args = [...arguments]
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
// 节流
// 连续触发事件但在n秒中只执行一次，避免某些事件频繁触发。如：按钮点击
export function throttle (func, wait = 1000) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

// 验证邮箱
export function checkEmail (rule, value, callback) {
  const regEmail = /^\w+@\w+(\.\w+)+$/
  if (regEmail.test(value)) return callback()
  callback(new Error('邮箱不合法'))
}

// 验证密码
export function checkPhone (rule, value, callback) {
  const regPhone = /^1[34578]\d{9}$/
  if (regPhone.test(value)) return callback()
  callback(new Error('手机号码不合法'))
}

// 根据id查询用户名
export function findUserById (id, array) {
  return array.find((item) => {
    return item.id === id
  })
}
