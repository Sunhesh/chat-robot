const formaDate = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${fill0(date.getMonth() + 1)}-${fill0(date.getDate())} ${fill0(date.getHours())}:${fill0(date.getMinutes())}:${fill0(date.getSeconds())}`
}

/* 补零操作 */
const fill0 = num => {
  return num < 10 ? '0' + num : num
}